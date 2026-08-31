# AI Mentor Worker deployment

The AI Mentor page is static; this Cloudflare Worker is the optional server-side proxy for mentor questions. It uses a Cloudflare Workers AI binding, so no provider API key appears in the site, browser JavaScript, generated files, or Git history.

## Deploy

1. Install and authenticate Wrangler in an environment with access to the intended Cloudflare account.
2. From `backend/`, update `wrangler.toml` with the exact public GitHub Pages origin in `ALLOWED_ORIGIN`. For a preview environment, use its own Worker and preview origin. Multiple origins may be comma-separated.
3. Deploy with `npx wrangler deploy` from `backend/`. The `AI` binding in `wrangler.toml` connects the Worker to Workers AI. Set the public Worker URL as the non-secret `ai-mentor-endpoint` meta value emitted for `/ai-mentors/` during the static-site integration. The checked-in fallback is `/api/mentor`.

The Worker uses the fixed `@cf/meta/llama-3.2-3b-instruct` model; a client cannot choose a model or submit a system prompt.

## Operational limits

Apply Cloudflare rate limiting/WAF rules to `POST /mentor` before public launch (per-IP and per-origin limits). Workers AI usage is subject to the account's current allocation and pricing. The Worker allows only configured browser origins, three fixed mentor IDs, 24 fixed chapters, and at most 12 short conversation messages.

## Test

Run the focused contract test from the repository root:

```sh
node --test tests/ai-mentor-backend.test.mjs
```

For a local smoke test, use a remote Workers AI binding and supply the exact local origin through `ALLOWED_ORIGIN`.

## Rollback

If the API needs to be disabled, remove or replace the `ai-mentor-endpoint` meta value in the static AI Mentor page, or roll the Worker back using Cloudflare's deployment history. The page's Copy Prompt and Open ChatGPT actions remain its safe no-backend fallback. Rotate the OpenAI key immediately if it is ever exposed.
