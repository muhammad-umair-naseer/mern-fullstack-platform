import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock,
  FileText,
  Fingerprint,
  HelpCircle,
  KeyRound,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the JWT Decoder tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Decoding proves nothing; verifying does. The guide separates the two
 *    and keys every signature failure to the exact message the tool shows.
 *
 * 2. Limits are stated plainly: no signing, no JWKS fetch, no certificates or
 *    PKCS#1 keys, no JWE or EdDSA, and only exp and nbf are checked.
 *
 * 3. Adjacent jobs are routed to the sibling tools that actually do them.
 */
export default function JwtDecoderSeoArticle() {
  const linkClass = 'text-orange-600 font-semibold underline hover:text-orange-700';

  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 9 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        <span className="text-orange-600 dark:text-orange-400">JWT Decoder</span>: How to Decode a JWT, Check Its Expiry and Verify Its Signature
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        An API returns 401 with &ldquo;invalid token&rdquo;, or a login works
        for an hour and then stops. Either way, you have a{' '}
        <strong>JWT</strong> and you need to see what is inside it. This guide
        shows how to <strong>decode JWT</strong> tokens with a free{' '}
        <strong>JWT decoder</strong>, read the header and payload as clean JSON,
        see when a token expires, and confirm its signature with the key you
        hold. It also covers why verification fails and what this{' '}
        <strong>JWT parser</strong> does not do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/jwt-decoder.webp"
            alt="JWT decoder online free - decode a JWT bearer token into its header, payload claims and expiry time, then verify the HS256 or RS256 signature"
            className="w-full h-auto object-cover max-h-[500px]"
            loading="lazy"
            width="1200"
            height="675"
            onError={(e) => {
              e.currentTarget.closest('.not-prose').style.display = 'none';
            }}
          />
          <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>
              Three parts, two of them readable by anyone. The third is the one
              that tells you whether to trust the other two.
            </span>
          </div>
        </div>
      </div>

      <nav className="my-10 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 not-prose">
        <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-lg">
          <Layers className="w-5 h-5 text-orange-500" />
          <span>Table of Contents</span>
        </div>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
          {[
            ['#what-is-jwt', '1. What Is a JWT? The Three Parts and the Claims'],
            ['#how-to-decode', '2. How to Decode a JWT Token in Three Steps'],
            ['#decode-vs-verify', '3. Decoding Is Not Verifying'],
            ['#verify-signature', '4. JWT Verify Signature Online: Secret or Public Key'],
            ['#invalid-signature', '5. JWT Invalid Signature or Malformed? The Fixes'],
            ['#expiry', '6. How to Check If a JWT Is Expired'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free JWT Decoder'],
            ['#faq', '8. Frequently Asked Questions (FAQ)'],
          ].map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition"
              >
                <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 1 */}
      <section id="what-is-jwt" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Is a JWT? The Three Parts and the Claims
        </h3>
        <p>
          A JSON Web Token, defined in{' '}
          <a
            href="https://datatracker.ietf.org/doc/html/rfc7519"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            RFC 7519
          </a>
          , is three base64url strings joined by dots: a <strong>header</strong>{' '}
          naming the signing algorithm, a <strong>payload</strong> carrying the
          claims, and a <strong>signature</strong> over the first two. The header
          and payload are only encoded, not encrypted, which is why any{' '}
          <strong>JWT decoder</strong> can turn them back into JSON. The claims
          you will meet most often are these:
        </p>
        <ul className="space-y-2">
          <li><strong>exp</strong> &mdash; the time the token expires.</li>
          <li><strong>iat</strong> &mdash; the time it was issued.</li>
          <li><strong>nbf</strong> &mdash; &ldquo;not before&rdquo;, the time it starts being valid.</li>
          <li><strong>iss</strong> &mdash; the issuer, usually your identity provider&rsquo;s URL.</li>
          <li><strong>sub</strong> &mdash; the subject, normally a user ID.</li>
          <li><strong>aud</strong> &mdash; the audience, a single value or a list of the APIs it is meant for.</li>
          <li><strong>kid</strong> &mdash; a header field naming which key signed it.</li>
        </ul>
        <p>
          Anything else, such as roles or scopes, is a custom claim added by the
          issuer. That is why people <strong>decode an ID token</strong> from an OpenID Connect
          login, <strong>decode an Azure AD access token</strong> to check its
          roles, scopes and audience, or <strong>decode a Firebase auth
          token</strong> to see a user&rsquo;s UID and custom claims. They all
          read the same way.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-decode" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Decode a JWT Token in Three Steps
        </h3>
        <p>
          Here is <strong>how to decode a JWT token</strong> with the tool above.
          The result updates as you type.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Paste the token.</strong> Replace the sample in the Token box
            with yours. To <strong>decode a bearer token</strong>, paste the
            whole Authorization header value: a leading <em>Bearer</em> is
            removed for you, and stray spaces or line breaks are ignored.
          </li>
          <li>
            <strong>Read the header and payload.</strong> Each appears as
            indented JSON you can copy or download as <em>header.json</em> and{' '}
            <em>payload.json</em>. This is <strong>how to read a JWT payload</strong>:
            user ID, roles and scopes are all there in plain text.
          </li>
          <li>
            <strong>Check the Claims list.</strong> It shows exp, iat and nbf as
            UTC dates with how long ago or how soon they fall, then iss, sub,
            aud, the algorithm and the key ID.
          </li>
        </ol>
        <p>
          Need to explore a very large payload? Copy it into the{' '}
          <Link to="/tools/json-formatter" className={linkClass}>
            JSON formatter
          </Link>
          . Found the token inside a redirect URL with percent
          escapes in it? Run it through the{' '}
          <Link to="/tools/url-encoder" className={linkClass}>
            URL encoder and decoder
          </Link>{' '}
          first, because a percent-encoded token will not split cleanly.
        </p>
      </section>

      {/* 3 */}
      <section id="decode-vs-verify" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-orange-500 shrink-0" />
          3. Decoding Is Not Verifying
        </h3>
        <p>
          You can <strong>decode a JWT without the secret</strong>, and that is
          exactly the problem with trusting a decoded token. Anyone can edit the
          payload, change <em>role</em> to <em>admin</em> and re-encode it. Only
          the signature shows whether the issuer produced those exact bytes,
          and checking it needs the key.
        </p>
        <p>
          A <strong>JWT debugger</strong> that only decodes tells you what a
          token claims; this one also checks it against the key you supply.
          That is the difference between a{' '}
          <strong>JWT token checker</strong> that looks at the expiry and a{' '}
          <strong>JWT validator</strong> that checks structure, expiry and
          signature together.
        </p>
      </section>

      {/* 4 */}
      <section id="verify-signature" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-orange-500 shrink-0" />
          4. JWT Verify Signature Online: Secret or Public Key
        </h3>
        <p>
          The tool reads the header&rsquo;s <em>alg</em> and offers the right
          check. For <strong>JWT verify signature online</strong>{' '}
          jobs there are two routes.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-orange-500 shrink-0" /> HS256, HS384, HS512
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To <strong>verify an HS256 JWT with a secret</strong>, type the
              shared secret into the Secret (HMAC) field. The answer appears
              straight away: the signature is valid for this secret, or it does
              not match. If your secret is stored encoded, tick{' '}
              <em>Secret is base64url-encoded</em> first.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-orange-500 shrink-0" /> RS, PS and ES algorithms
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              For RS256, PS256, ES256 and their larger siblings, a box appears
              for a PEM public key starting with{' '}
              <em>-----BEGIN PUBLIC KEY-----</em>. Paste it and press{' '}
              <em>Verify with public key</em> to see Signature VALID or INVALID.
            </p>
          </div>
        </div>
        <p>
          That second card is <strong>how to verify a JWT signature with a public
          key</strong>, and it covers the common cases: you can{' '}
          <strong>verify an RS256 JWT with a PEM public key</strong>, and the <strong>ES256 JWT verify online</strong> case
          works the same way for ECDSA tokens on the P-256, P-384 and P-521
          curves.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>What it does not do.</strong> It does not create or sign new
            tokens. It does not fetch keys from a JWKS URL, so you paste the
            public key yourself and pick the one matching the <em>kid</em>. It
            accepts a <em>BEGIN PUBLIC KEY</em> block only, not a certificate or
            a <em>BEGIN RSA PUBLIC KEY</em> block. Encrypted five-part tokens
            (JWE) and EdDSA signatures are not supported.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section id="invalid-signature" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          5. JWT Invalid Signature or Malformed? The Fixes
        </h3>
        <p>
          A <strong>JWT invalid signature</strong> error usually means the key is
          subtly wrong, not that the token was forged. Each message points to a
          fix:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>&ldquo;Signature does NOT match this secret.&rdquo;</strong>{' '}
            Check for a trailing space or the wrong environment&rsquo;s secret.
            The classic <strong>JWT base64 encoded secret</strong> trap is a
            secret that is stored encoded and decoded before signing: tick the
            base64url checkbox and try again.
          </li>
          <li>
            <strong>&ldquo;Signature INVALID.&rdquo;</strong> The key is well
            formed but is not the one that signed this token. Providers rotate
            keys, so compare the Key ID in the Claims list with the <em>kid</em>{' '}
            of the key you pasted.
          </li>
          <li>
            <strong>&ldquo;Could not verify&rdquo;</strong> followed by an error.
            The key could not be read. The usual cause is a certificate or an
            RSA-format block pasted instead of a <em>BEGIN PUBLIC KEY</em> block,
            or a key for a different algorithm family.
          </li>
          <li>
            <strong>&ldquo;Not a JWT: expected 3 dot-separated parts.&rdquo;</strong>{' '}
            This is the <strong>JWT malformed</strong> case, usually a truncated
            copy with the dots missing. &ldquo;Header is not valid base64url
            JSON&rdquo; or its payload twin names the broken part; a stray quote
            mark or a percent-encoded character is the usual culprit there.
          </li>
          <li>
            <strong>&ldquo;alg=none &mdash; this token is unsigned.&rdquo;</strong>{' '}
            The <strong>alg none JWT vulnerability</strong> is a token that
            declares no signature at all. A server that accepts one lets anyone
            write their own claims.{' '}
            <a
              href="https://datatracker.ietf.org/doc/html/rfc8725"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              RFC 8725
            </a>
            , the JWT best-practice document, tells libraries to reject it.
          </li>
        </ul>
        <p>
          Comparing two tokens? Paste both payloads into the{' '}
          <Link to="/tools/diff-checker" className={linkClass}>
            diff checker
          </Link>{' '}
          to spot the changed claim.
        </p>
      </section>

      {/* 6 */}
      <section id="expiry" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-orange-500 shrink-0" />
          6. How to Check If a JWT Is Expired
        </h3>
        <p>
          The <em>exp</em> claim is a Unix timestamp in seconds, which is
          useless to read by eye. This is <strong>how to check if a JWT is
          expired</strong>: paste it, and the Claims list does the{' '}
          <strong>JWT exp timestamp to date</strong> conversion for you, as a
          UTC date and time with &ldquo;N min ago&rdquo; or &ldquo;in N
          min&rdquo; beside it. A notice underneath says plainly whether the
          token is expired.
        </p>
        <p>
          That answers the <strong>JWT expired error</strong> question
          directly: you see the exact moment it lapsed, which usually shows
          whether the fault is a short lifetime or a missing refresh. For the opposite
          complaint, <strong>JWT not valid yet (nbf)</strong>, the page shows
          when the token starts being valid and warns when that is still in the
          future, which usually means two clocks disagree.
        </p>
        <p>
          Two honest limits. Times are shown in UTC and rounded to the minute;
          for local time zones or other timestamps, use the{' '}
          <Link to="/tools/timestamp-converter" className={linkClass}>
            timestamp converter
          </Link>
          . And only exp and nbf are checked: iss and aud are shown but not
          compared with expected values, and there is no clock-skew allowance.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free JWT Decoder
        </h3>
        <p>
          There are plenty of places to find a <strong>JWT decoder online
          free</strong>. Here is what is different about this one.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email and no usage counter. Paste a token and the result is there.'],
            ['Verifies, not just decodes', 'HMAC secrets for HS256, HS384 and HS512, plus PEM public keys for RS, PS and ES algorithms, all on one page.'],
            ['Tokens stay private', 'Tokens, secrets and keys are never stored on our servers, and nothing you paste is retained.'],
            ['Nothing is used for training', 'What you paste is never used to train anything. A production token stays yours.'],
            ['Readable times, not raw numbers', 'exp, iat and nbf appear as UTC dates with how long ago or how soon, plus a clear expired or not-yet-valid notice.'],
            ['Errors you can act on', 'Wrong secret, wrong key, unreadable key, malformed token and unsigned alg=none each get their own message.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                {title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          It sits among our{' '}
          <Link to="/tools" className={linkClass}>
            free developer and file tools
          </Link>
          , built on the same terms. Need a random <em>jti</em> for a test token?
          The{' '}
          <Link to="/tools/uuid-generator" className={linkClass}>
            UUID generator
          </Link>{' '}
          makes one, and the{' '}
          <Link to="/tools/hash-generator" className={linkClass}>
            hash generator
          </Link>{' '}
          computes a standalone HMAC or SHA hash of any text.
        </p>
      </section>

      {/* 8 */}
      <section id="faq" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-orange-500 shrink-0" />
          8. Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-6 mt-4">
          {[
            [
              'How do I decode a JWT for free?',
              'Paste the token into the box at the top of this page. The header and payload appear as formatted JSON straight away, with the expiry and other claims listed underneath. There is no account or sign-up.',
            ],
            [
              'Is it safe to paste a JWT into an online JWT decoder site?',
              'It depends on what the page does with it. On this page, tokens, secrets and keys are never stored on our servers, nothing is retained, and nothing is used for training. When you only need the structure, an expired or test token is the safer habit.',
            ],
            [
              'How do I decode an Azure AD access token or a Firebase auth token?',
              'Paste it into the Token box; a leading Bearer is removed for you. The payload shows the tenant or project as iss, the app as aud, and roles, scopes or custom claims as plain JSON. Both are usually RS256-signed, and their providers often publish keys as JWKS entries or certificates, which this tool does not accept, so convert the matching key to a BEGIN PUBLIC KEY block before verifying.',
            ],
            [
              'Can I decode a JWT without the secret?',
              'Yes. The header and payload are only base64url-encoded, so anyone can read them without a key. Without the secret or public key you cannot prove the token is genuine, so decoding alone is never validation.',
            ],
            [
              'Why does my JWT signature show as invalid?',
              'Usually the key is wrong. Check for a trailing space in the secret, tick the base64url box if the secret is stored encoded, and make sure the public key matches the kid in the header. A certificate pasted instead of a BEGIN PUBLIC KEY block cannot be read at all.',
            ],
            [
              'Can I verify a token using my provider\'s JWKS URL?',
              'Not directly. The tool does not fetch keys, and a JWKS lists keys in JSON (JWK) form rather than PEM. Open the JWKS document yourself, find the key whose kid matches the token, convert that key to a PEM public key with your usual crypto tooling, and paste the result. Certificates and BEGIN RSA PUBLIC KEY blocks are not accepted, only BEGIN PUBLIC KEY.',
            ],
            [
              'Can this tool create or sign a new JWT?',
              'No. It decodes and verifies existing tokens only; it has no generator and does not sign with a private key. Issue test tokens with your auth library, then paste them here.',
            ],
            [
              'Does it decrypt encrypted JWE tokens or verify EdDSA?',
              'No. Encrypted tokens with five parts and EdDSA or Ed25519 signatures are not supported. It handles signed tokens using HS, RS, PS and ES algorithms.',
            ],
            [
              'My string is base64 but not a JWT. What should I use?',
              'Use the Base64 encoder and decoder, which handles plain base64 and base64url text of any kind. This page only reads dot-separated JWT parts.',
            ],
          ].map(([q, a]) => (
            <div key={q}>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{q}</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-300">
          Working through an auth bug? Decode stray base64 values with the{' '}
          <Link to="/tools/base64-encoder-decoder" className={linkClass}>
            Base64 encoder and decoder
          </Link>
          , turn a Unix time from your logs into a readable date with the{' '}
          <Link to="/tools/timestamp-converter" className={linkClass}>
            timestamp converter
          </Link>
          , or test the pattern that pulls tokens out of those logs with the{' '}
          <Link to="/tools/regex-tester" className={linkClass}>
            regex tester
          </Link>
          . And if you would rather build token-based login than only debug it,
          our free{' '}
          <Link to="/learn/full-stack-web" className={linkClass}>
            full-stack web development course
          </Link>{' '}
          covers the authentication groundwork behind JWTs.
        </p>
      </div>
    </article>
  );
}
