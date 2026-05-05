# Commerce Surface Catalog

This catalog is a routing aid for agents and developers assembling Campaign Cart funnels from designed HTML. It should stay dry and predictable: use it to pick known template-family surfaces, not to make expensive visual guesses.

Machine-readable companion: [`commerce-surface-catalog.json`](./commerce-surface-catalog.json).

## Confidence Policy

Template family selection should be cheap and confidence-gated.

Prefer signals in this order:

1. Explicit user instruction.
2. CampaignSpec template fields.
3. Export folder/file names.
4. Unique commerce structure.
5. Distinct checkout layout structure.
6. Class-name fingerprints.

Do not infer from brand colors, product category, copy tone, or a single shared primitive such as `payment-methods.html`.

If the top family match is below high confidence, or if two families look plausible, ask the user before wiring commerce components. A good passback is:

> I can map this design to `olympus` or `olympus-mv-two-step`. The ambiguity is the tier card layout plus variant slot behavior. Which family should I use before wiring SDK components?

## Family Surface Matrix

| Family | Status | Primary Checkout Surface | Summary | Notes |
| --- | --- | --- | --- | --- |
| `olympus` | Partial frontmatter API exists | Tiered bundle selector | `cart-summary01-04` | Reference model from Meridian `theduo-v2`; `bundles:` frontmatter feeds `bundle-selector.html`. |
| `limos` | Needs promotion | Single offer card with native quantity stepper | `cart-summary02` accordion | Roadflare proved the desired surface; promote from inline template/campaign-local markup into a reusable include. |
| `demeter` | Needs promotion | Editorial tier cards | `cart-summary03` side cart | Veyra proved the desired surface; promote tier card pricing and summary choice into frontmatter. |
| `olympus-mv-single-step` | Needs promotion | MV configurable selector in checkout | `cart-summary03/04` | Treat as first-class, not standard Olympus. Variant slots and media behavior need their own API. |
| `olympus-mv-two-step` | Needs promotion | Select step + checkout review/payment | `cart-summary03/04` | Treat as first-class. The select page is a distinct commerce surface. |

## Surface Types

These are the commerce-ready surfaces the library should enumerate and grow over time:

- Checkout shell
- Main product selector
- Tiered bundle selector
- Single-offer quantity selector
- MV configurable selector
- Variant slot controls
- Product media/gallery
- Price and discount display
- Promo/timer bar
- Express checkout
- Card payment block
- Contact/address fields
- Order bump
- Cart/order summary
- Upsell selector and accept/skip actions
- Receipt/order confirmation
- Trust/guarantee/support blocks

Each reusable surface should document:

- Template family
- Variant name
- Required SDK hooks
- Accepted frontmatter inputs
- Supported page types
- Responsive contract
- QA checks
- Known failure modes

## Promotion Plan

Promote proven campaign-local work into template-family includes:

1. `limos/_includes/single-offer-quantity-selector.html`
2. `demeter/_includes/editorial-tier-selector.html`
3. `olympus-mv-single-step/_includes/mv-configurable-selector.html`
4. `olympus-mv-two-step/_includes/mv-selection-step.html`
5. Shared frontmatter contracts for `cart_summary_variant`, `price_display_variant`, `promo_timer`, and `order_bump_variant`.

The goal is not a small fixed set of templates. The goal is a growing library of commerce-ready surfaces that can be assembled into highly custom funnels while preserving SDK behavior.
