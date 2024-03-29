---
title: How to send an invoice in USDC
description: This post is a step by step guide on how to issue a crypto invoice in USDC stablecoin, that a client can then pay with MetaMask or any other crypto wallet.
published: true
publishedAt: 8 Mar 2023
publishedTimestamp: 2023-03-08
modifiedTimestamp: 2023-03-08
author_name: Gareth Fuller
author_twitter: garethafuller
---

# How to send an invoice in USDC
**tl;dr**: Follow this [link to the app](/?token=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48), fill out the invoice form and
click create. Then send the payment page link to your client. For a more
detailed explanation read on.

If you prefer video, here's a quick demo showing how to issue an invoice in
USDC:

<div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/b7fbfd5146ff488a804bbf309d71196e" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" class="rounded-xl shadow-lg"></iframe></div>

## 1. Fill out the invoice form
This step is pretty self explanatory, first pick USDC from the list of possible
invoice tokens.

<img src="/images/blog/posts/invoice-in-dai/token-select.png" alt="Select USDC
from tokens" class="h-56 rounded-xl shadow-xl" />

Then fill out the 'from' and 'to' information, where 'from' is the person or entity
issuing the invoice and 'to' is the person or entity to pay the invoice, i.e.
the client.

Next fill out the line items table to generate your invoice amount. Here add all
the services and costs you wish to invoice for. Where 'Unit type' is the type of
service or cost you are billing for, e.g. hours of work, 'Units' is the amount
of the 'Unit type' you have provided, e.g. 5 hours, and 'Price/unit' is the cost
of a single amount of your unit type, e.g. if your hourly rate is 100 USDC enter
100. Then the form will calculate to total for that line item. You can add as
many line items as you like.

<img src="/images/blog/posts/invoice-in-usdc/line-items.png" alt="Line items" class="rounded-xl shadow-xl" />

Once you've established your line items and generated your invoice amount in
USDC, you can add any additional information about this invoice that might be
useful for record keeping or as context for your client in the Information
section.

Now to the important part, how to get paid. In the payment details section enter
the Ethereum address where you want to recieve payment for this invoice in USDC.
In this field you can use an Ethereum address or ENS name.

<img src="/images/blog/posts/invoice-in-dai/payment-details.png" alt="Line items" class="rounded-xl shadow-xl" />

In this section you can also change the network you want to be paid on. Beware
that if you change the network it will reset the token to the native token for
that network and you will have to set the token to USDC again.

Finally, we have the optional password settings. You can prevent the payment
page for your USDC invoice being public by setting a password. For further
privacy protection you can toggle Encrypt E2E which uses your password to
encrypt the invoice data from end-to-end which means only users with your
password will ever be able to access the data associated with the invoice.

And that's it, you can now click 'Create this invoice' to generate the invoice
payment page.

## 2. Share the invoice page
Once created you will be presented with the payment page.

<img src="/images/blog/posts/invoice-in-usdc/payment-page.png" alt="Line items" class="rounded-xl shadow-xl" />

Simply copy the URL and forward that to your client. They can then choose to pay
the invoice off with their USDC tokens using MetaMask or any wallet that works
with WalletConnect. They can also partially pay off the invoice buy changing the
amount to be sent when the transaction is triggered in their wallet.

And that's it, you can now issue invoices in USDC and get paid!
