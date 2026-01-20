# Quick AI Shorts — Developer Quickstart

Get a local dev environment running in under 5 minutes.

Local dev environment 5 minute mein ready karo.

---

## Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- Docker (for FFmpeg worker)
- S3-compatible bucket (or local MinIO)

Node.js 20+, pnpm, Docker, aur S3-compatible bucket chahiye.

---

## 1. Clone Repository

```bash
git clone https://github.com/your-org/quickai-shorts.git
cd quickai-shorts
```

---

## 2. Environment Variables

Create `.env.local` in project root:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development

# Storage (S3-compatible)
S3_BUCKET=quickai-shorts-dev
S3_REGION=us-east-1
S3_ACCESS_KEY=your_access_key
S3_SECRET_KEY=your_secret_key
S3_ENDPOINT=http://localhost:9000  # MinIO for local dev

# Job Queue
QUEUE_URL=redis://localhost:6379

# Worker
JOB_WORKER_URL=http://localhost:8080
```

`.env.local` file banao. S3, Redis, Worker URLs set karo.

---

## 3. Install Dependencies

```bash
pnpm install
```

Or with npm:

```bash
npm install
```

---

## 4. Start Development Server

```bash
pnpm dev
```

Frontend runs at `http://localhost:3000`.

Frontend `http://localhost:3000` pe chalega.

---

## 5. Start FFmpeg Worker (Local Docker)

```bash
docker run --rm -it \
  -v $(pwd)/media:/media \
  -p 8080:8080 \
  quickai/ffmpeg-worker:latest \
  ./worker --listen 0.0.0.0:8080
```

For Windows PowerShell:

```powershell
docker run --rm -it `
  -v ${PWD}/media:/media `
  -p 8080:8080 `
  quickai/ffmpeg-worker:latest `
  ./worker --listen 0.0.0.0:8080
```

FFmpeg worker Docker mein chalo. Port 8080 pe listen karega.

---

## 6. Start Redis (Local)

```bash
docker run --rm -p 6379:6379 redis:alpine
```

---

## 7. Test the Pipeline

Hit the clip preview endpoint with a test URL:

```bash
curl -X POST http://localhost:3000/api/clip-preview \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=test123"}'
```

Ya browser mein `/api/clip-preview` endpoint ko test karo.

---

## Folder Structure

```
quickai-shorts/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React components
│   ├── lib/           # Utilities, API clients
│   └── styles/        # Global CSS
├── public/            # Static assets
├── media/             # Local media storage (dev)
└── scripts/           # Build/deploy scripts
```

---

## Common Issues

| Issue                   | Fix                                          |
| ----------------------- | -------------------------------------------- |
| `ECONNREFUSED` on Redis | Start Redis container first                  |
| Worker timeout          | Check Docker network connectivity            |
| S3 access denied        | Verify bucket policies and credentials       |
| FFmpeg not found        | Ensure worker container has FFmpeg installed |

---

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Check [ffmpeg.sh](./ffmpeg.sh) for production FFmpeg commands
- Review [SECURITY.md](./SECURITY.md) before handling user data

---

**Questions?** Open an issue or check existing docs.

Sawaal? Issue kholo ya docs check karo.
