# La-Tike: Local Setup (Docker + Mobile Testing)

This guide gets the API, PostgreSQL and pgAdmin running locally with Docker, then
points the mobile app (Expo Go or an EAS preview build) at it.

## Services

| Service    | Container         | Host address                         | Notes                                   |
|------------|-------------------|--------------------------------------|-----------------------------------------|
| PostgreSQL | `latike-postgres` | `localhost:5433`                     | 5433 avoids clashing with other Postgres containers |
| pgAdmin    | `latike-pgadmin`  | http://localhost:5051                | Server "La-Tike (docker)" is pre-registered |
| API        | `latike-server`   | http://localhost:5000/api/v1         | Also reachable from your phone on the same Wi-Fi |
| Redis      | `latike-redis`    | `localhost:6381` (profile `cache`)   | Not used by the API yet                 |
| nginx      | `latike-nginx`    | ports 80/443 (profile `prod`)        | Needs `nginx/ssl/cert.pem` + `key.pem`  |

Postgres and pgAdmin only listen on `127.0.0.1`. The API listens on all interfaces
so a phone on your network can reach it.

## 1. Configure

```bash
# Compose settings: database/pgAdmin passwords and ports
cp .env.example .env            # then change both passwords

# API settings
cp server/.env.example server/.env
```

In `server/.env`:
- Set `DATABASE_URL` to use the `POSTGRES_PASSWORD` from the root `.env` (port `5433`).
  Compose overrides it inside the container, so this value is only used by `npm run dev`.
- Fill in `JWT_SECRET`, `JWT_REFRESH_SECRET` and `QR_SECRET_KEY` (16+ characters each).
  The API refuses to start without them.
- Keep `PAYMENTS_MODE=mock` for testing: purchases complete without Stripe.

## 2. Start the stack

```bash
docker compose up -d --build     # postgres + pgadmin + api
docker compose ps                # all should become "healthy"
curl http://localhost:5000/api/v1/health
```

The API container runs `prisma migrate deploy` on every start, so the schema is
always up to date.

**Database only** (run the API on your machine with hot reload instead):

```bash
docker compose up -d postgres pgadmin
cd server
npm install
npx prisma migrate deploy
npm run dev
```

## 3. Sample data

Run from `server/` on your machine (it connects through `localhost:5433`):

```bash
npm run seed
```

This **wipes** all data and creates test accounts (password `password123`):

| Role     | Email                 |
|----------|-----------------------|
| Customer | customer@latike.com   |
| Host     | host@latike.com       |
| Admin    | admin@latike.com      |

Event dates are relative to today, so the sample events are always upcoming.

## 4. pgAdmin

Open http://localhost:5051 and log in with `PGADMIN_EMAIL` / `PGADMIN_PASSWORD`
from the root `.env`. Expand **Servers → La-Tike (docker)** and enter the
`POSTGRES_PASSWORD` when asked.

The pre-registered server is only loaded when the `pgadmin_data` volume is
first created. If you don't see it, add a server manually: host `postgres`,
port `5432`, user `latike`.

> pgAdmin rejects `.local` email addresses (for example `admin@latike.local`) and
> will restart in a loop. Use a normal-looking domain.

## 5. Point the mobile app at the API

The app picks its API URL in this order:

1. `EXPO_PUBLIC_API_URL`, set per build profile in `mobile/eas.json`.
2. In development (Expo Go / `npx expo start`): the IP of the computer running
   Metro, port 5000. This works automatically on a phone on the same Wi-Fi.
3. Android emulator fallback: `10.0.2.2:5000`.

For an **EAS preview build**, `eas.json` → `build.preview.env.EXPO_PUBLIC_API_URL`
must be your computer's LAN IP, for example `http://192.168.100.35:5000/api/v1`.
Find it with `ipconfig` (the "Wireless LAN adapter Wi-Fi" IPv4 address). Rebuild
after changing it: the URL is baked into the app at build time.

If the phone can't connect:
- The phone and computer must be on the same Wi-Fi network.
- Allow Node/Docker through Windows Firewall on **private** networks (port 5000).
- Open `http://<LAN-IP>:5000/api/v1/health` in the phone's browser to test.

## 6. Build and install with EAS

```bash
cd mobile
eas init                                    # first time only: links the project to your Expo account
eas build --profile preview --platform android
```

When the build finishes, open the link or scan the QR code on your Android phone
to install the APK.

iOS builds need a paid Apple Developer account and a registered device
(`eas device:create`).

## Useful commands

```bash
docker compose logs -f server               # API logs
docker compose exec postgres psql -U latike -d latike_db
docker compose down                         # stop (data is kept)
docker compose down -v                      # stop and DELETE all data
```

## Changing the database schema

```bash
cd server
# edit prisma/schema.prisma, then:
npx prisma migrate dev --name describe-your-change
```

Commit the new folder in `server/prisma/migrations/`. The container applies it on
its next start.
