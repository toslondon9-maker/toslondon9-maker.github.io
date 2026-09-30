# Pricing EUR audit

## Scope

- Keep GBP as the payment currency and preserve every existing PayPal URL and numeric payment amount.
- Add the approved approximate EUR display beside each public paid offer in English and Spanish.
- Keep the free seven-day experience and the Amazon-controlled book page free of new pricing.
- Cover canonical sources, generated HTML, route output and regression tests.

## Verification

- Run focused pricing and affected route tests, then the complete test suite with Windows test isolation disabled if required.
- Run the deterministic build, `git diff --check`, and static desktop/mobile preview checks.
- Do not commit, push, publish or deploy; leave the isolated worktree ready for review.
