---
title: What a mobile app really costs in Pakistan
description: Real cost bands for building an app in Pakistan, what moves a quote between them, what is always extra, and when a website is the cheaper answer.
author: Umair
date: 2026-08-28
tags: [pricing, mobile, flutter]
targetQuery: mobile app development cost in pakistan
image: /blog/covers/what-a-mobile-app-really-costs-in-pakistan.webp
imageAlt: "Mobile application financial budget spreadsheet and sprint cost estimation on a modern desk"
---

Most app quotes in Pakistan are wrong in the same two ways. They price the screens and forget the server, and they price an app for someone who actually needed a website.

So before any numbers: an app is not one thing you buy, it is usually three. There is the app on the phone, a backend that stores and serves the data, and an admin panel so somebody at your end can run the business without calling a developer. Ask for a quote on the first one alone and you get a small number that grows later.

Everything below is for the Pakistani market: local teams in Islamabad, Lahore or Karachi, billed in PKR. Rates from US, UK or Gulf agencies are a different economy and not a useful comparison.

## Table of Contents
- [The Real Cost Bands in Pakistan](#the-bands)
- [Cross-Platform (Flutter/React Native) vs Native Costs](#cross-platform-or-native-and-what-it-does-to-the-price)
- [What Is Always Extra in a Quote](#what-is-always-extra)
- [Keeping the App Alive: Ongoing Maintenance](#the-cost-nobody-mentions-keeping-the-app-alive)
- [Payment Gateways and In-App Purchases in Pakistan](#payments-specifically-in-pakistan)
- [When an App Is the Wrong First Answer](#when-an-app-is-the-wrong-first-answer)
- [What a Suspiciously Cheap Quote Leaves Out](#what-a-suspiciously-cheap-quote-usually-means)
- [Crucial Questions to Ask Any Development Agency](#questions-to-ask-any-agency-including-us)
- [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)

## The bands

These assume one cross platform code base shipping to both stores, and a team that has done this before.

**A single purpose app with no backend of its own.** A utility, a reader, a menu, a course viewer that pulls from an API or CMS you already have. No accounts, or sign in through Google only. Nobody needs a dashboard because the content already lives somewhere that has one.

**PKR 150,000 to 300,000.** Cross platform, published to both stores.

**An app with accounts, a backend and an admin panel.** This is the common case and the one most people are describing when they say "an app". Users register, their data lives on your server, your staff manage it through a web dashboard, push notifications go out, there are two or three user roles.

**PKR 300,000 to 500,000.** The common case: app, backend and an admin panel you can actually run the business from.

**A transactional app.** Payments, order flow, status tracking, wallets or credits, several roles that see different things (customer, vendor, rider, admin), reporting that somebody actually reads. Money moving through it raises the testing burden sharply on its own.

**PKR 450,000 upward.** Payments, roles and an order flow put this at the top of the local range, around four to five lakh for the involved builds.

**A marketplace, live tracking, in app chat, or anything with a compliance requirement.** This is not really a band, it is a project. Anyone quoting it in one line without a paid discovery phase is guessing, and guessing low.

**Start with a paid discovery phase.** Marketplace and logistics work is not quotable from a brief, and any figure given before discovery is a guess dressed as a price.

## Cross platform or native, and what it does to the price

Flutter and React Native let one team write one code base that ships to both stores. Native means Kotlin for Android and Swift for iOS, which in practice means writing the same product twice.

Native earns its cost when the app leans hard on the device: sustained background location, Bluetooth peripherals, serious camera or video work, high performance graphics, or a need for brand new OS features the week they ship. For most business apps, cross platform is not a compromise, it is the correct engineering decision.

The dishonest version of this pitch is "one code base, so half the price". Cross platform saves most of the UI and logic cost, not the platform cost. Someone still has to configure signing for both stores, wire push notifications twice, handle permissions the way each OS wants, write two sets of store listings, and fix the screen that misbehaves on a four year old Android. Budget for that work either way.

**Roughly a third to a half again**, for the same scope built twice. Native is worth it when you lean hard on the camera, background location or platform specific hardware, and rarely otherwise.

We teach both for free, [Flutter](/learn/flutter-mobile) and [React Native](/learn/react-native), and our default when we [build for clients](/services) is cross platform unless the requirements argue otherwise.

## What is always extra

None of this is in a development quote. All of it is your bill.

| Item | Paid by | How often |
| --- | --- | --- |
| Google Play developer account | You | One time |
| Apple Developer Program | You | Yearly |
| Backend hosting and database | You | Monthly |
| Domain and SSL | You | Yearly |
| Push notification service | You | Free at low volume, priced by volume later |
| SMS for OTP | You | Per message |
| Payment gateway | You | Setup plus a cut of every transaction |
| Maps and other third party APIs | You | Per usage |
| Maintenance | You | Yearly, see below |

The store accounts are billed in USD, so the rupee cost moves with the exchange rate. Both stores also verify business identity before a company can publish, which takes weeks of paperwork. Apple asks organisations for a D-U-N-S number, Google runs its own verification, and the requirements change often enough that you should read their developer sites this month rather than trust a blog from last year. Start that early, not the week you want to launch.

Google Play charges a one-time registration fee (see [Google Play Console developer account registration](https://support.google.com/googleplay/android-developer/answer/6112436)) and Apple charges annually through the [Apple Developer Program](https://developer.apple.com/programs/enroll/). Both are billed in dollars, so the rupee figure moves with the exchange rate. Check the current rates on each store's developer page rather than trusting a number in an article.

## The cost nobody mentions: keeping the app alive

Websites decay slowly. Apps rot on a schedule set by other people.

Android and iOS each ship a major version every year. Google Play requires apps to target a reasonably recent API level and enforces it with deadlines, so an app nobody touches eventually stops being updatable and then stops being downloadable. Libraries get deprecated, payment SDKs change, review rules move, certificates expire.

One failure mode is worth naming on its own. If you hold your own Android signing key and lose it, you cannot publish an update to that listing again, ever. If you are enrolled in Play App Signing, Google holds the signing key and an upload key can be reset, which is much safer. Find out which of those you are on and where the keys live. The answer should not be "on the laptop of the developer we used in 2023".

Budget a maintenance line for every year the app is live, including years where you ask for no new features. Paying nothing for two years is how a working app becomes a rebuild.

**Budget an annual retainer of roughly 15 to 20 percent of the build cost** to keep an app alive against OS updates and store policy changes. This is the line most quotes leave out and the one that surprises people in year two.

## Payments, specifically in Pakistan

Card gateways here need a registered business, a company bank account and underwriting. Onboarding runs in weeks and can fail, so start it in parallel with development or it becomes the thing holding up launch.

The rule that surprises people: if you sell digital goods consumed inside the app, such as coins, premium tiers or unlockable content, the stores generally require their own billing and take a commission. Physical goods and real world services booked through an app are usually outside that. Those rules change, so confirm against current App Store and Play policy before building a business model on either answer.

Cash on delivery is also still normal here, so plenty of apps launch with no gateway at all and add one when volume justifies the fees.

## When an app is the wrong first answer

An app has to be installed. That is the whole problem, and no amount of design fixes it.

A website is one tap from a search result, a WhatsApp message or a printed QR code. An app asks a stranger to visit a store, wait for a download, and give up storage on a phone that is probably already full. For a clinic, a restaurant, a school, a shop or a services business, a fast responsive website plus a WhatsApp number will usually reach more people than an app costing several times as much.

An app earns its price in three situations: the same people use it weekly or more, it needs the device itself for camera, GPS or offline use, or it is for your own staff, riders, field agents or branch teams, where you control the installs.

The reason usually given for building one anyway is push notifications. Fair, but push only reaches people who installed the app and did not mute it. For a lot of local businesses, WhatsApp reaches more of them, which is what our [Your Bot](/your-bot) work is for. That channel has its own rules: opt in, message templates that need approval, and pricing Meta revises, so check their current documentation rather than any figure in an article, including this one.

## What a suspiciously cheap quote usually means

It is not always a scam. It is almost always one of these:

- It is the app only. The backend, which is often the larger half, is not in the number.
- It is a template with your logo on it, which is fine if that is what you were told you were buying.
- Store submission, review responses and rejections are excluded.
- Testing happens on the developer's own phone and nothing else.
- Someone is learning on your project. Reasonable at a training rate, expensive if you were not told.
- It is a fixed price against a scope nobody has written down. The gap comes out of quality where you cannot see it.
- Maintenance is not mentioned, because the plan is to quote it later.
- The accounts and the code stay with the vendor, which turns your next quote into a hostage negotiation.

## Questions to ask any agency, including us

- Who owns the source code and the store accounts on day one? The correct answer is you, with both stores registered to your company.
- Is the backend in this price? Show me the admin panel a client of yours actually uses.
- Cross platform or native for my case, and what specifically makes you say that?
- What is deliberately not in this quote?
- What does a year cost after handover if I ask for no new features?
- Which devices do you test on? A budget Android from a few years ago should be on that list, not only a recent iPhone.
- Show me an app of yours live on both stores right now, and open it on your phone.

If a quote is far below the bands above, one of those answers explains why. Ask before you sign, not after.

## Frequently Asked Questions (FAQ)

### How much does it cost to build a mobile app in Pakistan on average?
A standard custom mobile app with user authentication, a cloud backend, and a web admin panel typically costs between PKR 300,000 and PKR 500,000 in Pakistan. Simple single-purpose apps range from PKR 150,000 to PKR 300,000, while multi-role marketplaces (like Careem or Foodpanda clones) start above PKR 800,000.

### Should I choose Flutter or Native (Kotlin/Swift) for my mobile app?
For 90% of commercial business apps, Flutter is the most cost-effective choice. It allows a single development team to deploy high-performance apps to both the Apple App Store and Google Play Store simultaneously, reducing build and maintenance costs by 35% to 45%.

### How much do Google Play and Apple App Store accounts cost in Pakistan?
Google Play charges a one-time developer registration fee of $25 USD. Apple charges an annual Developer Program membership fee of $99 USD/year. Both fees are paid directly to Google and Apple using a foreign-currency-enabled international debit/credit card.

### What annual maintenance budget should I expect for a mobile app?
Budget approximately 15% to 20% of your initial development cost annually. This ensures regular updates for new Android/iOS versions, SDK patches, security updates, and Google Play target API level compliance.

---

*If you want a second opinion on a quote you already have, [tell us what you are building](/contact). If you would rather build it yourself, our [Flutter course](/learn/flutter-mobile) is free and covers the cross platform route described above.*
