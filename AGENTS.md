# PDAM Tirta Pakuan — Agent Guide

## Stack
- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript strict
- **Styling**: Tailwind v4 (CSS-first, no `tailwind.config.js` — config in `app/globals.css` via `@theme inline`)
- **UI Library**: shadcn/ui (radix-nova style) — components in `components/ui/`
- **Icons**: Tabler Icons (`@tabler/icons-react`) + Lucide React
- **Animation**: Framer Motion
- **Notifications**: react-toastify (use distinct `containerId` per form)
- **Path alias**: `@/*` → root

## Commands
| Command | Action |
|---|---|
| `npm run dev` | Dev server (localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint (flat config in `eslint.config.mjs`) |

No test suite or typecheck script exists.

## Routes
| Path | Access |
|---|---|
| `/` | Public landing page |
| `/sign-in` | Login (redirects by role: ADMIN → `/admin/profile`, CUSTOMER → `/customer/profile`) |
| `/sign-up` | Register admin account only |
| `/admin/*` | Admin dashboard — layout: `app/admin/layout.tsx` with `AppSidebar` |
| `/customer/*` | Customer dashboard — layout: `app/customer/layout.tsx` with `CustomerSidebar` |

## Auth
- POST `${NEXT_PUBLIC_BASE_URL}/auth` with body `{ username, password }` and header `app-key: ${NEXT_PUBLIC_APP_KEY}`
- Token stored as httpOnly, sameSite=strict cookie via `helper/cookies.ts` (maxAge: 1 day despite comment saying 7)
- Logout in `components/logout.tsx` — deletes cookie, redirects to `/sign-in`
- `.env` contains `NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_APP_KEY`

## API Conventions
- All requests include `app-key` header
- Registration: POST to `${NEXT_PUBLIC_BASE_URL}/admins` (admin registration only)
- Response shape: `{ success?: boolean, message: string, token?: string, role?: string }`

## Key Conventions
- **Admin sub-pages**: `admin/bills/add/`, `admin/bills/edit/`, `admin/bills/verify/`, `admin/customers/add/`, `admin/customers/edit/`, `admin/customers/view/`, `admin/services/add/`, `admin/services/edit/`
- **Customer sub-pages**: `customer/bills/pay.tsx`
- `sign-in/page-old.tsx` is a stale reference — the active version is `sign-in/page.tsx`
- Alerts use `@radix-ui/react-alert-dialog` (not shadcn Dialog)
- Each `<form>` with react-toastify uses a unique `containerId` string
- CSS theme variables managed via `@theme inline` and Tailwind v4 `@custom-variant dark`
- PostCSS only loads `@tailwindcss/postcss` plugin
