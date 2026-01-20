# Quick AI Shorts — Architecture & Deployment

High-level system design and production deployment notes.

System design aur production deployment ki details.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                    (Next.js 15 Frontend)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EDGE / CDN LAYER                           │
│              (Vercel Edge, CloudFront, etc.)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVERLESS API ROUTES                        │
│           (Next.js API Routes / Vercel Functions)               │
│                                                                 │
│   /api/fetch-video    → Queue download job                     │
│   /api/transcribe     → Queue transcription job                │
│   /api/clip-preview   → Return preview segments                │
│   /api/export         → Queue final render job                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       JOB QUEUE                                 │
│              (Redis / BullMQ / Managed Queue)                   │
│                                                                 │
│   Job Types: download, transcribe, crop, render, cleanup       │
│   Visibility timeout, retries, dead-letter queue               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     WORKER POOL                                 │
│        (Containers / Spot Instances / Serverless Jobs)          │
│                                                                 │
│   FFmpeg Workers: transcode, crop, subtitle burn-in            │
│   Whisper Workers: audio extraction, transcription             │
│   Autoscale by queue depth                                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OBJECT STORAGE                               │
│               (S3 / R2 / MinIO / GCS)                           │
│                                                                 │
│   /originals/     → Raw downloaded videos                      │
│   /proxies/       → Low-res previews for UI                    │
│   /exports/       → Final rendered Shorts                      │
│   /captions/      → SRT/VTT files                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Layer

**Stack:** Next.js 15 + React + Tailwind CSS v4 + Motion

**Deployment:** Vercel (optimized for Next.js 15)

**Key Features:**

- App Router with server components
- ISR for landing pages
- Client components for editor interactions
- Motion-powered animations (Hydro-Glass design system)

Frontend Next.js 15 pe hai. Vercel pe deploy karo. Server components aur ISR use karo.

---

## Backend / API Layer

**Stack:** Next.js API Routes (Serverless Functions)

**Responsibilities:**

- Validate user input
- Create jobs in queue
- Return job status
- Serve presigned URLs for uploads/downloads

API routes light operations handle karti hain. Heavy work queue mein jata hai.

---

## Job Queue Layer

**Stack:** Redis + BullMQ (or managed: AWS SQS, Google Cloud Tasks)

**Job Types:**
| Job | Description | Timeout |
|-----|-------------|---------|
| `download` | Fetch video from source | 5 min |
| `transcribe` | Extract audio + run STT | 10 min |
| `analyze` | Identify highlight segments | 2 min |
| `render` | FFmpeg crop + subtitle burn | 15 min |
| `cleanup` | Delete temp files | 1 min |

**Configuration:**

- Visibility timeout per job type
- Automatic retries (3x with backoff)
- Dead-letter queue for failed jobs
- Alert on queue depth > 2x normal

Redis queue use karo. Har job ka timeout alag hai. Retry aur dead-letter queue configure karo.

---

## Worker Layer

**Stack:** Docker containers with FFmpeg + Python (Whisper)

**Deployment Options:**
| Option | Pros | Cons |
|--------|------|------|
| AWS Fargate Spot | Cost-effective, scales | 2min spin-up |
| GCP Cloud Run Jobs | Zero idle cost | Cold starts |
| Fly.io Machines | Fast spin-up | Manual scaling |
| Dedicated GPU | Fastest Whisper | High fixed cost |

**Recommendation:** Use spot/preemptible instances for video rendering. Use CPU-optimized instances for Whisper (faster-whisper with INT8 quantization).

Spot instances use karo for cost efficiency. Whisper ke liye faster-whisper INT8 use karo.

---

## Transcription Pipeline

```
Video → Extract Audio (16kHz WAV) → Whisper/Google STT → Post-process → SRT
```

**Whisper Configuration:**

- Model: `faster-whisper` with `small.en` or `medium.en`
- Quantization: INT8 for CPU, FP16 for GPU
- Word-level timestamps: enabled
- Post-processing: punctuation normalization, low-confidence removal

**Google STT Alternative:**

- Use long-running batch recognize for files > 1 min
- Request word-level timestamps
- Apply confidence threshold (0.8+)

**SRT Validation:**

- Max 2s gap between captions
- Max 42 characters per line
- Force line breaks at punctuation

Audio extract karo 16kHz pe. Whisper ya Google STT use karo. SRT validate karo.

---

## Storage Architecture

**Buckets:**

```
quickai-shorts-originals/    # Raw source videos (encrypted)
quickai-shorts-proxies/      # Low-res previews (720p)
quickai-shorts-exports/      # Final rendered Shorts
quickai-shorts-captions/     # SRT/VTT files
```

**Lifecycle Rules:**

- Originals: Delete after 7 days (or user request)
- Proxies: Delete after 24 hours
- Exports: User-controlled retention
- Captions: Delete with parent video

**Access:**

- Presigned URLs for uploads/downloads
- No direct public access
- CDN in front of exports bucket

S3 buckets alag karo. Lifecycle rules set karo. Presigned URLs use karo.

---

## CDN Layer

**Stack:** CloudFront / Cloudflare / Vercel Edge

**Caching Strategy:**

- Static assets: 1 year cache
- Exported videos: Cache with ETag validation
- API responses: No cache (or short TTL for status)

CDN se exports serve karo. Static assets aggressive cache karo.

---

## Monitoring & Observability

**Metrics:**

- Queue depth (alert at 2x normal)
- Job success/failure rate
- Worker utilization
- API latency (p50, p95, p99)

**Logging:**

- Structured JSON logs
- Job ID correlation across services
- Error stack traces

**Tracing:**

- Distributed tracing for job lifecycle
- End-to-end latency tracking

**Alerts:**

- Queue depth spike
- Worker crash loop
- Job failure rate > 5%
- Storage approaching quota

Metrics, logs, traces setup karo. Queue depth aur failure rate pe alert lagao.

---

## Scaling Recommendations

| Load             | Workers          | Queue         | Storage |
| ---------------- | ---------------- | ------------- | ------- |
| 100 users/day    | 2 spot instances | Single Redis  | 100 GB  |
| 1,000 users/day  | 5-10 autoscaled  | Redis cluster | 1 TB    |
| 10,000 users/day | 20-50 autoscaled | Managed queue | 10 TB   |

**Cost Optimization:**

- Use spot/preemptible instances (70% savings)
- Use provider Serverless Jobs feature
- Delete temp files aggressively
- Compress proxies heavily

Spot instances use karo. Temp files delete karo. Proxies compress karo.

---

## Deployment Checklist

```
[ ] Frontend deployed to Vercel
[ ] API routes configured
[ ] Redis/queue running
[ ] Worker pool autoscaling configured
[ ] S3 buckets created with lifecycle rules
[ ] CDN configured for exports
[ ] Monitoring dashboards set up
[ ] Alerts configured
[ ] Error tracking (Sentry) connected
[ ] Load test completed
```

---

**Reference:** See [ffmpeg.sh](./ffmpeg.sh) for production FFmpeg commands.
