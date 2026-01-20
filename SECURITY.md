# Quick AI Shorts — Security & Privacy

Production security checklist and privacy guidelines.

Security checklist aur privacy guidelines.

---

## Authentication & Authorization

- [ ] **OAuth required** for user accounts (Google, GitHub, or email magic link)
- [ ] **Session tokens** stored securely (httpOnly, secure, sameSite)
- [ ] **API rate limiting** enabled per user and per IP
- [ ] **CORS** configured for production domains only
- [ ] **CSRF protection** on all state-changing endpoints

OAuth mandatory hai. Sessions secure karo. Rate limiting lagao.

---

## Data Minimization

- [ ] **Store minimal PII** — only email and display name
- [ ] **No tracking** of source video URLs after processing
- [ ] **No analytics** on video content itself
- [ ] **User ID** used for audit, not personal identifiers
- [ ] **Delete unused accounts** after 12 months inactivity

Minimal PII store karo. Content track mat karo.

---

## Storage Security

- [ ] **Originals encrypted at rest** (AES-256 or provider default)
- [ ] **Bucket policies** deny public access
- [ ] **Presigned URLs** for all uploads/downloads (short expiry: 15 min)
- [ ] **Separate buckets** for originals, proxies, exports
- [ ] **Versioning disabled** (avoid storing deleted content)

Originals encrypt karo. Presigned URLs use karo. Public access deny karo.

---

## Data Retention

| Data Type      | Retention         | Trigger                |
| -------------- | ----------------- | ---------------------- |
| Original video | 7 days            | Auto-delete            |
| Proxy video    | 24 hours          | Auto-delete            |
| Exported Short | User-controlled   | User delete or 90 days |
| Captions (SRT) | With parent video | Cascade delete         |
| Job logs       | 30 days           | Auto-rotate            |

Retention windows define karo. Auto-delete configure karo.

---

## User Rights (GDPR/CCPA)

- [ ] **Data export** — user can download all their data
- [ ] **Data deletion** — user can delete account and all content
- [ ] **Processing consent** — clear terms before first upload
- [ ] **Cookie consent** — for analytics/marketing cookies only
- [ ] **Right to object** — easy opt-out for non-essential processing

User data export aur delete ka option do. Consent pehle lo.

---

## Caption Security

- [ ] **Sanitize auto-generated captions** — remove sensitive phrases
- [ ] **Flag low-confidence transcriptions** for user review
- [ ] **No storage of raw audio** after transcription
- [ ] **Captions scoped to user** — no sharing without consent

Captions sanitize karo. Raw audio delete karo.

---

## Content Moderation

- [ ] **No scanning of user content** without consent
- [ ] **Abuse reporting** mechanism available
- [ ] **Terms of Service** prohibit illegal content
- [ ] **Manual review process** for reported content

Content scan mat karo bina consent ke. Abuse report ka option do.

---

## Infrastructure Security

- [ ] **Secrets in environment variables** or secret manager
- [ ] **No hardcoded credentials** in code
- [ ] **Dependencies audited** monthly (`npm audit`, `pip-audit`)
- [ ] **Container images scanned** for vulnerabilities
- [ ] **Network isolation** — workers cannot access internet (except S3)

Secrets env mein rakho. Dependencies audit karo.

---

## Audit Logging

Log the following events (structured JSON, 30-day retention):

```json
{
  "event": "video.export",
  "user_id": "usr_abc123",
  "job_id": "job_xyz789",
  "timestamp": "2024-01-15T10:30:00Z",
  "ip": "203.0.113.45",
  "user_agent": "Mozilla/5.0..."
}
```

**Events to log:**

- User login/logout
- Video upload initiated
- Export completed
- Video deleted
- Account settings changed
- Failed authentication attempts

Job lifecycle log karo. Who exported what, when — sab track karo.

---

## Incident Response

1. **Detect** — Automated alerts on anomalies
2. **Contain** — Isolate affected systems
3. **Investigate** — Trace with audit logs
4. **Notify** — Users within 72 hours (GDPR requirement)
5. **Remediate** — Patch and prevent recurrence

Incident detect karo, contain karo, notify karo (72 hours).

---

## Third-Party Services

Document all third-party data processors:

| Service        | Purpose       | Data Shared  | DPA Signed |
| -------------- | ------------- | ------------ | ---------- |
| Vercel         | Hosting       | Request logs | Yes        |
| AWS S3         | Storage       | Video files  | Yes        |
| OpenAI Whisper | Transcription | Audio only   | Yes        |
| Stripe         | Payments      | Billing info | Yes        |

Third-party services ka DPA (Data Processing Agreement) sign karo.

---

## Security Checklist (Pre-Launch)

```
[ ] All secrets in secret manager
[ ] HTTPS enforced everywhere
[ ] Rate limiting configured
[ ] CORS locked to production domains
[ ] Bucket policies reviewed
[ ] Dependency audit passed
[ ] Penetration test completed
[ ] Privacy policy published
[ ] Cookie consent implemented
[ ] Data retention automation tested
[ ] Incident response plan documented
```

---

## Reporting Security Issues

If you discover a security vulnerability, please report it privately:

**Email:** security@quickaishorts.com

Do not open public issues for security vulnerabilities.

Security issue mile to privately report karo. Public issue mat kholo.

---

**Security is not a feature. It is a foundation.**
