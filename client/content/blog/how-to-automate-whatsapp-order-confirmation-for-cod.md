---
title: How to automate WhatsApp order confirmation for COD
description: The message flow that confirms a cash on delivery order before dispatch, the wording we would send, and what automation genuinely cannot fix.
date: 2026-08-28
tags: [whatsapp, ecommerce, automation]
targetQuery: how to automate whatsapp order confirmation
---

You need three things: a number on the WhatsApp Business Platform, a message template Meta approved before you ever sent it, and something on your side that reads the customer's reply and flips the order to confirmed or cancelled before it reaches the courier. The part that trips people up is that your business has to start this conversation, and starting a conversation is the one thing WhatsApp will not let you do in free text.

Here is the whole flow for a cash on delivery order, the wording we would actually send, and the parts of the fake order problem no automation touches.

## The flow, stage by stage

| Stage | What triggers it | Who starts the message | What you may send |
| --- | --- | --- | --- |
| Confirmation | Order placed on your site or Instagram | You | Approved template, with buttons |
| Reply | Customer taps Confirm or Cancel | Customer | Anything, for the next 24 hours |
| Follow up | No reply by your cutoff | You | One more template, then a phone call |
| Dispatch | Parcel handed to the courier | You | Approved template with the tracking number |
| Delivery or failed attempt | Courier status changes | You | Approved template |

Every row where you start the message needs a template approved in advance. That is the platform, not a limitation of any particular tool.

## Why the first message cannot be free text

When a customer messages your business, a 24 hour window opens, and inside it you can reply with whatever words you like. That has held for years, measured from their most recent message.

A customer who typed their number into a checkout form has not messaged you, so no window is open. The confirmation, the message you most want to send, has to be a **message template**: fixed wording with variable slots, submitted to Meta and reviewed before first use. You also need the customer's opt in.

Order updates are the textbook case for the utility category rather than marketing, and the categories are priced differently. Be careful with any specific figure on that, including ours. Meta has reworked template pricing more than once, at points making utility templates free inside an open window, and rates vary by country. Check the current rules first.

None of this applies to the cheap tools that log into WhatsApp Web with a QR code, which is why people buy them, and why they lose the number: pushing automated order messages through the consumer app is the pattern that gets numbers banned, usually on the day volume finally matters.

## Opt in, done so it holds up

The requirement is that the person knowingly agreed to receive WhatsApp messages from your business, which means the checkout page says so in plain language next to the phone field, not buried in terms nobody opens.

Log the number, the timestamp and where consent was collected against every order. If a template is ever questioned, that record is all you have. A number scraped from an Instagram comment is not opt in, and using it turns a good sending record into a bad one.

## What the confirmation should actually say

Assume the customer has not saved your number and has ordered from four other pages this week. The message has to identify you, restate the order so an error is obvious, and make the cash amount clear before a rider is at the door with it.

```
Assalam o Alaikum {{1}}, this is {{2}}.

Your order {{3}} is ready to dispatch:
{{4}}
Payment: Cash on delivery, Rs {{5}}
Address: {{6}}

Please confirm and we will send it today.
```

The Confirm and Cancel buttons are not part of that text. Quick reply buttons are a separate component you configure in the template editor, so typing them into the body is a rejection. Meta's formatting rules for the body itself move around often enough to check before you submit: a variable may not open or close the body, and two variables may not sit next to each other.

Two things about that wording are deliberate.

**The total appears before dispatch, not at the door.** Price shock at handover is a real cause of refusal, and this is the one moment where fixing it costs nothing.

**The reply is a button, not a word.** Ask people to reply YES and you will receive "yes", "Yes bhai", "ok", a voice note, a sticker, and a photo of the product with a question mark. A quick reply button sends a fixed payload your code can act on. Free text still arrives, so keep a human inbox behind it.

Language is worth testing rather than assuming. Templates can be submitted in more than one language, and Roman Urdu often reads more naturally to a Pakistani customer base than formal Urdu script. Match how your customers already write to you.

## When nobody replies

Silence is the common case and the one most flows handle badly.

Set a cutoff that matches your dispatch schedule, send **one** follow up template, then call. Do not send five. Each costs money, and people who did not want the first three tap block, which drags down your number's quality rating and eventually your messaging limits.

Then decide in advance what silence means, because it depends on the order:

| Order value | Reasonable default on no reply |
| --- | --- |
| Low, thin margin | Ship it. A return costs less than the sales you lose by holding |
| High value, or a first time buyer | Hold, and call before the parcel moves |
| Repeat customer with a delivery history | Ship it, you have the evidence |

Choosing one rule for every order is how a confirmation flow ends up suppressing good revenue in the name of preventing returns.

## What delivery status tells you about a number

The most useful output of this flow is not the Confirm button. It is the delivery status of your own message.

The API sends webhooks for sent, delivered and read, and an error when a send fails outright. A message that fails is a strong signal the number is wrong, and knowing that before you have paid to move a parcel across the country and back is worth having.

A message that reaches sent and stops there is much weaker evidence. The ordinary reason is a handset that is switched off, out of coverage or otherwise offline, which describes a fair share of a COD customer base on any given afternoon. Treat it as a reason to call, not a reason to cancel. The API does not always distinguish one failure reason from another either, so read the actual error instead of assuming the number was invented.

What it does not catch is a real number belonging to someone who orders for fun and refuses at the door. Nothing catches that in advance. The only defence is storing outcomes against phone numbers so a known refuser is treated differently, which is order history, not messaging.

## Dispatch and delivery updates

Once the customer taps a button the window is open, but by the time the parcel ships it has usually closed again, so these are templates too.

```
Good news {{1}}, your order {{2}} has been dispatched with {{3}}.
Tracking number: {{4}}
Expected delivery: {{5}}

Please keep Rs {{6}} ready. Reply here if the address or timing needs to change.
```

That last line matters more than the tracking number. It turns a broadcast into a conversation, which is when a customer tells you they are at work until six, and how a failed delivery attempt becomes a successful one.

The integration work here is usually the courier, not WhatsApp. Some local couriers expose a status API, some expose something closer to a spreadsheet, and your notifications are only as good as whichever feed you are on.

## What this will not fix

A confirmation flow gets sold as a cure for returns. It is not one.

- **Returns caused by the listing.** If the product does not match the photos or the size chart is wrong, the customer confirms happily and refuses at the door. Confirmation surfaces the price, not the expectation gap.
- **Prank orders from real, working numbers.** Covered above. History helps, messaging does not.
- **Your own maths.** You pay per template on every order, including the ones that cancel and the ones that were never real. If your order values are small and your return rate is already low, three templates per order can cost more than the problem they prevent. A return usually costs the courier charge both ways plus handling, so the arithmetic tends to favour confirming, but measure yours before you build anything.

## Should you build this at all

If you ship a handful of orders a day, no. Install the free WhatsApp Business app, save your confirmation text as a quick reply, and have a person send it. It is sanctioned, costs nothing, and beats any integration project.

The case for automating starts when confirmations get missed, when dispatch happens before anyone read the replies, or when the person doing it by hand is the bottleneck between order and courier.

When you do build it, WhatsApp is the easy half. The hard half is the order state machine behind it: one order cannot be confirmed twice, a manual confirmation by phone has to update the same field the bot writes to, courier statuses arriving out of order must not announce delivery before dispatch, and a retry after a timeout must not fire a second template. That is ordinary backend engineering, and our free [Node.js backend course](/learn/nodejs-backend) covers webhooks and idempotent handlers if you would rather understand it than buy it.

If your order data lives in three places that do not talk to each other, messaging is not your problem and [custom software](/services) probably is. We would rather say so now than sell you a bot that sends confident updates about the wrong stock levels.

---

*[Your Bot](/your-bot) builds these flows on Meta's official platform, and if your volume does not justify it yet we will say so.*
