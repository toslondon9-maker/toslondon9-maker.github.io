# AI Mentor Worker deployment

The AI Mentor page is static; this Cloudflare Worker is the optional server-side proxy for mentor questions. It is deliberately separate so the OpenAI key never appears in the site, browser JavaScript, generated files, or Git history.

## Deploy

1. Install and authenticate Wrangler in an environment with access to the intended Cloudflare account.
2. From `backend/`, update `wrangler.toml` with the exact public GitHub Pages origin in `ALLOWED_ORIGIN`. For a preview environment, use its own Worker and preview origin. Multiple origins may be comma-separated.
3. Set the secret interactively; do not put it in `wrangler.toml`, `.env.example`, commits, CI logs, or static-site settings:

   ```sh
   npx wrangler secret put OPENAI_API_KEY
   ```

4. Deploy with `npx wrangler deploy` from `backend/`. Set the public Worker URL as the non-secret `ai-mentor-endpoint` meta value emitted for `/ai-mentors/` during the static-site integration. The checked-in fallback is `/api/mentor`.

`OPENAI_MODEL` is retained as a deployment setting, but the Worker only accepts `gpt-5.6-luna`; a client cannot choose a model or submit a system prompt.

## Operational limits

Apply Cloudflare rate limiting/WAF rules to `POST /mentor` before public launch (per-IP and per-origin limits), and use an OpenAI project with a restricted key, a monthly spend limit, and usage alerts. The Worker allows only configured browser origins, three fixed mentor IDs, 24 fixed chapters, and at most 12 short conversation messages. It uses `store: false` for Responses API requests.

## Test

Run the focused contract test from the repository root:

```sh
node --test tests/ai-mentor-backend.test.mjs
```

For a local smoke test, set `OPENAI_API_KEY` as a local Wrangler secret and supply the exact local origin through `ALLOWED_ORIGIN`; never add a real value to `.env.example`.

## Rollback

If the API needs to be disabled, remove or replace the `ai-mentor-endpoint` meta value in the static AI Mentor page, or roll the Worker back using Cloudflare's deployment history. The page's Copy Prompt and Open ChatGPT actions remain its safe no-backend fallback. Rotate the OpenAI key immediately if it is ever exposed.
