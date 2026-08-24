# luanvan2024 — Pet care & veterinary platform

Graduation thesis project (2024). A booking and medical-records system for
veterinary clinics, with three surfaces on one API: a web app for clinic staff,
a React client for pet owners, and a Flutter mobile app.

## Domain

The system treats a pet — not an appointment — as the record that persists.
Everything else hangs off it:

```
Owner ──< Pet ──< MedicalRecord ──< Medication
                    │
                    └──< Booking ──> Schedule ──> Vet
                             │
                             └──> Invoice
```

- **Pets** carry breed and breed-type classification, so clinics can filter
  case history by species rather than by free-text notes.
- **Medical records** are per-visit and reference the medications dispensed,
  which is what makes a pet's history readable a year later.
- **Bookings** resolve against a vet's `Schedule`, so double-booking is
  prevented at the data layer rather than in the UI.
- **Invoices** are generated from the visit, and **reviews** are tied to a
  completed booking so ratings cannot be left by someone who never came in.

## Two identity models on purpose

The API carries two user collections, and the split is deliberate rather than
accidental:

| Collection | Who | Auth |
|---|---|---|
| `user` | Clinic staff and web users | Email + password, bcrypt, JWT in an httpOnly cookie |
| `usersApp` | Mobile pet owners | Google / Firebase — **no password hash stored at all** |

Mobile users never set a password, so the schema does not have a field for one.
Storing a nullable password column for an identity provider that owns the
credential is how leaks happen later.

## Architecture

```
                    ┌─ frontend/            React + TypeScript (web)
Express + TS API ───┼─ flutter_petcare_app/ Flutter (iOS/Android)
   MongoDB          └─ Socket.IO            live booking notifications
```

- **Express 4 + TypeScript + Mongoose 8** over MongoDB
- **Stripe** for payment on invoices
- **Socket.IO** pushes booking state changes to the clinic dashboard —
  `BookingsNotifications.tsx` consumes this
- **Cloudinary** for pet and clinic images, uploaded via `multer`
- **express-validator** at the route boundary; **bcryptjs** + **jsonwebtoken**
  for the web identity

The Flutter app follows a feature-first layout (`features/<name>/data` and
`/presentation`) rather than grouping by widget type, which keeps a screen and
the model it renders in the same folder.

## Running it

```bash
# API
cd backend && npm install && cp .env.example .env   # Mongo URI, JWT secret, Stripe, Cloudinary
npm run dev

# Web
cd frontend && npm install && npm run dev

# Mobile
cd flutter_petcare_app && flutter pub get && flutter run
```
