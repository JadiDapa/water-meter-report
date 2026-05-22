# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint
```

No test framework is configured in this project.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| Database | PostgreSQL via Prisma 7 + `pg` adapter |
| Auth | Clerk v7 |
| Styling | Tailwind CSS 4 + `cn()` (clsx + tailwind-merge) |
| UI primitives | shadcn/ui (Radix UI based), Base UI React |
| Forms | React Hook Form + Zod resolvers |
| Tables | TanStack React Table v8 |
| State/cache | TanStack React Query v5 |
| Charts | Recharts |
| Toast | Sonner |
| Icons | Lucide React |
| Theme | next-themes |
| PWA | next-pwa |

---

## Architecture

### Route Groups

```
app/
  page.tsx                    # Root redirect → /admin | /technician | /customer
  (auth)/sign-in/             # Public — Clerk sign-in
  (admin)/                    # Admin layout (sidebar + navbar), enforces ADMIN role
    admin/
      reports/[id]/           # /admin/reports, /admin/reports/[id]
      complaints/[id]/        # /admin/complaints, /admin/complaints/[id]
      users/
        customers/[id]/building/[buildingSlug]/
        technicians/[id]/
  (technician)/               # Technician layout (same sidebar + navbar), enforces TECHNICIAN role
    technician/
      my-reports/create/[id]/ # /technician/my-reports, create, [id]
      my-complaints/create/[id]/
      customers/[id]/building/[buildingSlug]/
  (customer)/                 # Customer layout (simple top navbar, no sidebar), enforces CUSTOMER role
    customer/
      reports/[id]/
      complaints/[id]/
  api/images/[filename]/      # Only REST route — serves uploaded images
```

### URL Map by role
- **ADMIN**: `/admin`, `/admin/reports`, `/admin/complaints`, `/admin/users`, `/admin/users/customers`, `/admin/users/technicians`
- **TECHNICIAN**: `/technician`, `/technician/my-reports`, `/technician/my-complaints`, `/technician/customers`
- **CUSTOMER**: `/customer`, `/customer/reports/[id]`, `/customer/complaints/[id]`

### Data Flow

```
Client Component
  → Server Action (app/actions/*.actions.ts)
      → Validates with Zod schema (servers/validators/*.validator.ts)
      → Calls Service static method (servers/services/*.service.ts)
          → Prisma → PostgreSQL
      → revalidatePath() to bust Next.js cache
```

There are **no API routes for mutations** — everything goes through Server Actions. The only API route is image serving (`/api/images/[filename]`).

### Authentication & Roles

Clerk handles auth. `middleware.ts` protects all routes except `/sign-in` and `/api/images/*` using `clerkMiddleware`. `getCurrentUser()` in `app/actions/user.actions.ts` resolves the Clerk session to a database `User` via `username`.

Three roles: `ADMIN`, `CUSTOMER`, `TECHNICIAN`.

Role enforcement:
- `middleware.ts` — guards unauthenticated access (redirects to `/sign-in`)
- `app/page.tsx` — redirects `/` to the role's home (`/admin`, `/technician`, `/customer`)
- Each role's `layout.tsx` — checks `user.role` and redirects wrong-role users back to `/`

Sidebar menus are role-specific: `adminMenuItems` and `technicianMenuItems` in `lib/sidebar-menu.ts`. Each layout passes its own menu array to `DashboardSidebar`. Customer layout uses `CustomerNavbar` (no sidebar).

---

## Database Schema

**All models use `Int` auto-increment primary keys and `createdAt`/`updatedAt` timestamps.**

### User
```
id, name, username (unique), role (ADMIN|CUSTOMER|TECHNICIAN)
→ Customer (one-to-one)
→ Technician (one-to-one)
```

### Customer
```
id, userId (FK→User, unique), customerId (string, unique),
fullname, phoneNumber, address, buildingSlug (FK→Building)
→ Building (many-to-one)
→ Report[] (one-to-many)
→ Complaint[] (one-to-many)
```

### Building
```
id, slug (unique), name, description?
→ Customer[] (one-to-many)
```

### Technician
```
id, userId (FK→User, unique), fullname, phoneNumber, region?
→ Report[] (one-to-many)
→ Complaint[] (one-to-many)
```

### Report
```
id, technicianId (FK→Technician), customerId (FK→Customer),
location, values (String — JSON: {"current": number, "previous": number})
→ Image[] (one-to-many)
```
> `values` is stored as a JSON string, not a JSON column. Parse with `JSON.parse(report.values)` to get `{ current, previous }`.

### Complaint
```
id, customerId (FK→Customer), technicianId (FK→Technician),
location, title, description?
→ Image[] (one-to-many)
```

### Image
```
id, url (/api/images/{uuid}.ext), filename, size,
reportId? (FK→Report), complaintId? (FK→Complaint)
```

---

## Service Layer Pattern

Services live in `servers/services/` and only expose static methods. All database access goes here — never call Prisma from actions or components directly.

```ts
// Pattern
export class ReportService {
  static async getAll() { /* ... */ }
  static async getById(id: number) { /* ... */ }
  static async create(data: CreateReportDTO, images: File[] = []) { /* ... */ }
  static async update(id: number, data: UpdateReportDTO) { /* ... */ }
  static async delete(id: number) { /* ... */ }
  static async list(opts?: ReportListOptions) { /* paginated */ }
}
```

The `getAll()` methods typically include full relations (user info on customer/technician, images). The `list()` methods return `{ items, meta: { page, pageSize, total, totalPages } }` with a default pageSize of 20.

**Image upload in services**: `ReportService.create()` and `ComplaintService.create()` both handle image files — they write files to `process.cwd()/uploads/images/{uuid}.{ext}` and create `Image` records with `url: /api/images/{filename}`.

---

## Validator Pattern

Each entity has a validator file in `servers/validators/` with:

```ts
// Zod schemas
export const CreateReportSchema = z.object({ ... })
export const UpdateReportSchema = CreateReportSchema.partial()

// Types inferred from schema
export type CreateReportDTO = z.infer<typeof CreateReportSchema>

// Prisma type alias with common includes pre-baked
export type ReportType = Prisma.ReportGetPayload<{
  include: { customer: { include: { user: true } }, technician: { include: { user: true } }, images: true }
}>
```

The `*Type` exports (e.g., `ReportType`, `CustomerType`) are the go-to types for components that receive fully-loaded records from services.

**Coercion**: `technicianId` and `customerId` in report/complaint validators use `z.coerce.number()` because FormData sends everything as strings.

---

## Server Actions Pattern

```ts
"use server"

export async function createReport(formData: FormData) {
  const rawData = {
    technicianId: formData.get("technicianId"),
    // ...
    images: formData.getAll("images"),
  }
  const validated = CreateReportSchema.parse(rawData)
  const images = rawData.images.filter((f): f is File => f instanceof File && f.size > 0)
  await ReportService.create(validated, images)
  revalidatePath("/reports")
}
```

Actions that take typed objects (not FormData) validate with `Schema.parse()` before calling the service. Actions call `revalidatePath()` after mutations.

---

## UI & Component Conventions

### className utility
```ts
import { cn } from "@/lib/utils"
// cn() merges Tailwind classes and resolves conflicts
```

### Component location
- `components/ui/` — generic primitives (button, dialog, table, input, etc.), never import from here directly in page files; use through domain components
- `components/root/` — all dashboard-specific components (tables, stats, forms, dialogs)
- `components/auth/` — sign-in form

### Tables
All data tables use TanStack React Table v8 wrapped in `components/root/DataTable.tsx`. Column definitions use a factory function pattern (`createReportColumns(basePath)`) so the detail-page link can be role-aware. Always pass `basePath` when using `ReportTable`, `ComplaintTable`, `CustomerTable`, or `TechnicianTable`:
```tsx
<ReportTable reports={reports} basePath="/admin/reports" />
<CustomerTable customers={customers} basePath="/technician/customers" />
```

### Forms
All forms use **React Hook Form** with `zodResolver`. FormData-based actions (create report/complaint with images) are submitted via `form.action`, not `handleSubmit`.

### Dialogs
Create dialogs (`CreateReportDialog`, `CreateCustomerDialog`, etc.) wrap forms in `components/ui/dialog.tsx`. The dialog manages open state locally.

### Stats components
`ReportStats`, `ComplaintStats`, `TechnicianStats` etc. take an array of records and compute counts/trends internally — they are purely presentational.

### Charts
`WaterUsageChart` uses Recharts to display report values over time. The `values` JSON string must be parsed to extract `current`/`previous` meter readings.

---

## Sidebar Menu System

`lib/sidebar-menu.ts` defines `MenuItem[]` arrays. Each item can have `roles?: UserRole[]` — if absent, all roles see it.

```ts
// To add a new menu item visible only to ADMIN:
{ title: "New Feature", url: "/new-feature", icon: SomeIcon, roles: [UserRole.ADMIN] }
```

`filterMenuByRole(items, role)` is called in `DashboardSidebar.tsx` to produce the visible menu.

---

## Image Serving

Uploaded images are stored at `uploads/images/` (git-ignored) and served by `app/api/images/[filename]/route.ts`. The route:
- Blocks path traversal (`..` check)
- Sets `Cache-Control: public, max-age=31536000`
- Detects MIME type by extension (png, jpg, jpeg, webp, gif)

When referencing images in components, use the `url` field from `Image` records directly — it's already the correct `/api/images/...` path.

---

## Language

The UI is in **Indonesian**. Use Indonesian for all user-facing strings:
- "Laporan" = Reports
- "Keluhan" = Complaints
- "Pelanggan" = Customers
- "Teknisi" = Technicians
- "Pengguna" = Users
- "Bangunan" = Building

---

## Known Quirks

- `report.values` is a `String` field storing JSON — always `JSON.parse(report.values)` before accessing `current`/`previous`.
- The technician action file has a naming inconsistency: `updateTechnician` internally uses the parameter name `customerId` — this is a bug, not intended behavior.
- `CustomerService.getAll()` filters complaints/reports to the **current month only** (createdAt ≥ month start) for stats purposes.
- The `building.actions.ts` exports a function called `updateUser` instead of `updateBuilding` — this is also a naming bug.
- Prisma schema is split into files under `prisma/schema/` (multi-file schema feature).
- The generated Prisma client is in `generated/` (not `node_modules/.prisma`).
