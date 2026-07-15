# ☕ CoffeeTakeAway

Takeaway ordering website & app that lets customers browse the menu, order, pay, and track order status — reducing reliance on third-party delivery apps.

**Live demo:** open `index.html` in your browser — no build step required.

## Features
- 📋 Digital menu with categories (Cà phê, Trà, Bánh) & filtering
- 🛒 Cart / order-ticket panel with live totals
- 🕒 Pickup time selection + order notes
- 🧾 Order confirmation flow
- 📱 Fully responsive — works as a mobile web app (PWA-ready)

## Tech stack
- HTML / CSS / vanilla JavaScript (no dependencies, no build step)
- Next phase: React frontend + Node.js/Express backend + PostgreSQL for real orders, payments (Momo/ZaloPay/VNPay), and an admin dashboard

## Getting started
```bash
git clone https://github.com/tinloc/CoffeeTakeAway.git
cd CoffeeTakeAway
open index.html   # or just double-click the file
```

## Roadmap
- [ ] Connect to a real backend (Node.js + PostgreSQL) to persist orders
- [ ] Online payment integration (Momo, ZaloPay, VNPay)
- [ ] Admin dashboard for managing menu items & incoming orders
- [ ] Push notifications when an order is ready
- [ ] Package as an installable PWA / React Native app

## License
No license — private/commercial project.