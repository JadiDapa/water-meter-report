# PDAM Tirta Musi — Water Meter Report System

A web-based water meter reporting and complaint management system for PDAM Tirta Musi. Built with Next.js App Router, featuring role-based dashboards for admins, technicians, and customers.

---

## Features

### Admin
- Dashboard with stats (total reports, complaints, customers, technicians) and monthly trend charts
- Full CRUD on reports, complaints, customers, technicians, users, and buildings
- Building category management with create/edit/delete
- Customer list grouped by building

### Technician
- Dashboard with personal report and complaint stats
- Create and manage water meter reports with photo uploads
- Create and manage complaints
- Browse customer list by building

### Customer
- View personal water usage history and chart
- View own reports and complaints

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Database | PostgreSQL via Prisma 7 + `pg` adapter |
| Auth | Clerk v7 |
| Styling | Tailwind CSS 4 + `cn()` (clsx + tailwind-merge) |
| UI | shadcn/ui (Radix UI), Base UI React |
| Forms | React Hook Form + Zod resolvers |
| Tables | TanStack React Table v8 |
| Charts | Recharts (via shadcn chart) |
| Toast | Sonner |
| Icons | Lucide React |
| Theme | next-themes |
| PWA | next-pwa |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# Push the database schema
npx prisma db push

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/water-meter-report"

# Clerk Authentication — https://clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

## Commands

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint

npx prisma db push      # Push schema to database
npx prisma studio       # Open Prisma Studio (database GUI)
```

---

## Project Structure

```
app/
├── (auth)/sign-in/           # Clerk sign-in page
├── (admin)/admin/            # Admin dashboard & management
│   ├── reports/
│   ├── complaints/
│   ├── users/customers/
│   ├── users/technicians/
│   └── settings/
├── (technician)/technician/  # Technician portal
│   ├── my-reports/
│   ├── my-complaints/
│   ├── customers/
│   └── settings/
├── (customer)/customer/      # Customer portal
│   ├── reports/[id]/
│   └── complaints/[id]/
└── api/images/[filename]/    # Image serving endpoint

components/root/              # Domain components (tables, forms, dialogs, stats)
components/ui/                # shadcn/ui primitives
servers/
├── services/                 # Data access layer (static class methods)
└── validators/               # Zod schemas + Prisma type aliases
lib/                          # Utilities (cn, sidebar menu)
prisma/schema/                # Multi-file Prisma schema
uploads/images/               # Uploaded images (git-ignored)
```

---

## Roles & Access

| Role | Home | Capabilities |
|---|---|---|
| `ADMIN` | `/admin` | Full CRUD on all data, user & building management |
| `TECHNICIAN` | `/technician` | Create/edit reports & complaints, view customers |
| `CUSTOMER` | `/customer` | View own reports and complaints |

Clerk handles authentication. The root page (`/`) redirects each user to their role's home. Each role's layout enforces access — wrong-role users are redirected to `/`.

> Users must be created by an admin first. The username in the app must match the Clerk account username exactly.

---

## Data Flow

```
Client Component
  → Server Action  (app/actions/*.actions.ts)
      → Zod validation  (servers/validators/)
      → Service method  (servers/services/)
          → Prisma → PostgreSQL
      → revalidatePath()
```

All mutations go through Server Actions. The only REST route is `/api/images/[filename]` for serving uploaded images.

---

## Image Uploads

Report and complaint creation supports multiple image uploads via drag-and-drop. Files are written to `uploads/images/` (git-ignored) and served via `/api/images/[filename]`. The route blocks path traversal and sets long-lived cache headers.

---

## Notes

- `report.values` stores the current meter reading as a plain number string (e.g. `"150"`), representing m³.
- `CustomerService.getAll()` filters complaints/reports to the current month for stats display purposes.
- The Prisma client is generated to `generated/` (not `node_modules/.prisma`).
- Prisma schema uses the multi-file feature under `prisma/schema/`.
