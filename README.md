# SupplyLine — Supply Chain Dashboard

Split from a single 1,269-line JSX file into a standard Vite + React + Tailwind project.

## Setup

```bash
npm install
npm run dev
```

## Structure

```
src/
├── data/
│   └── mockData.js          # SITES, ITEMS, VENDORS, ROLES, PERMISSIONS, seed data
├── utils/
│   └── helpers.js           # siteName(), itemName(), inr(), STATUS_STYLES, etc.
├── components/
│   ├── common/               # Reusable UI primitives
│   │   ├── Badge.jsx
│   │   ├── Card.jsx
│   │   ├── EmptyState.jsx
│   │   ├── FileDrop.jsx
│   │   ├── Kpi.jsx
│   │   ├── Locked.jsx
│   │   ├── Modal.jsx
│   │   ├── PipelineTracker.jsx
│   │   └── SortableTh.jsx
│   └── layout/
│       ├── Sidebar.jsx       # Left nav, role-aware locking
│       └── Topbar.jsx        # Search, site filter, role switcher
├── pages/                    # One file per route/screen
│   ├── Dashboard.jsx
│   ├── RequirementsPage.jsx
│   ├── QuotationsPage.jsx
│   ├── POPage.jsx
│   ├── DispatchPage.jsx
│   ├── ReceivingPage.jsx
│   ├── PaymentsPage.jsx
│   ├── StockPage.jsx
│   └── AccessPage.jsx
├── App.jsx                   # Top-level state + routing between pages
├── main.jsx                  # React DOM entry
└── index.css                 # Tailwind directives
```

## Notes

- All state (`requirements`, `quotations`, `pos`, `stock`, `role`, `page`, etc.) still lives in `App.jsx` and is passed down as props, exactly like the original single-file version — no behavior changed.
- Role-based permissions come from `PERMISSIONS` in `mockData.js` and drive which nav items/pages are locked (`<Locked />`).
- Verified with `npm run build` — compiles cleanly with Vite.
