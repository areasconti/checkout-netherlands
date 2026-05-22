/**
 * <promo-banner> — Winkelwagen reservering countdown banner
 *
 * Toont een afteltimer van 19 minuten. De starttijd wordt bewaard in
 * sessionStorage zodat de timer doorloopt bij paginaverversing.
 *
 * Desktop:  [⏱] Uw winkelwagen & korting zijn gereserveerd — nog [MM:SS]
 * Mobile:   [⏱] Winkelwagen gereserveerd — nog [MM:SS]
 *
 * ─── URL PARAMS ─────────────────────────────────────────────────────────────
 *   ?banner=n   Verberg de gehele bannersectie (SDK-niveau, op de wrapper).
 * ────────────────────────────────────────────────────────────────────────────
 */
class PromoBanner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.timerInterval = null;
  }

  connectedCallback() {
    this.style.display = 'block';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: inherit; }

        .cart-banner {
          background-color: var(--brand--color--primary, #3c7dff);
          color: #fff;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 42px;
          box-sizing: border-box;
        }

        /* Clock SVG icon — pure white strokes, always visible on any brand colour */
        .cart-banner__icon {
          flex-shrink: 0;
          display: block;
          width: 18px;
          height: 18px;
        }

        /* Desktop label (full text) */
        .cart-banner__label {
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
        }

        /* Mobile label (shorter text) — hidden by default */
        .cart-banner__label--short {
          display: none;
        }

        /* Countdown pill */
        .cart-banner__countdown {
          background: rgba(0, 0, 0, 0.18);
          border-radius: 6px;
          padding: 3px 12px;
          font-size: 15px;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.07em;
          flex-shrink: 0;
          white-space: nowrap;
        }

        /* ── Tablet / small desktop ─────────────────────────────────────── */
        @media (max-width: 600px) {
          .cart-banner__label--full { display: none; }
          .cart-banner__label--short { display: block; font-size: 13px; }
          .cart-banner__countdown { font-size: 14px; padding: 3px 10px; }
          .cart-banner { gap: 8px; padding: 9px 14px; }
        }

        /* ── Very small screens ─────────────────────────────────────────── */
        @media (max-width: 360px) {
          .cart-banner { gap: 6px; padding: 8px 10px; }
          .cart-banner__icon { width: 15px; height: 15px; }
          .cart-banner__label--short { font-size: 12px; }
          .cart-banner__countdown { font-size: 13px; padding: 2px 8px; }
        }
      </style>

      <div class="cart-banner">
        <!-- Clock icon: pure white so it pops on any background colour -->
        <svg class="cart-banner__icon" viewBox="0 0 24 24" fill="none"
             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" stroke="white" stroke-width="2"/>
          <path d="M12 7v5.25l3.25 2" stroke="white" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <!-- Full label — hidden below 600 px -->
        <span class="cart-banner__label cart-banner__label--full">
          Uw winkelwagen &amp; korting zijn gereserveerd — nog
        </span>

        <!-- Short label — visible below 600 px -->
        <span class="cart-banner__label cart-banner__label--short">
          Winkelwagen gereserveerd — nog
        </span>

        <!-- Live countdown -->
        <span class="cart-banner__countdown" id="cart-countdown">19:00</span>
      </div>
    `;

    this.startCountdown();
  }

  startCountdown() {
    const DURATION = 19 * 60; // 19 minuten in seconden
    const KEY = 'gk_cart_reserve_start';

    let startTime = sessionStorage.getItem(KEY);
    if (!startTime) {
      startTime = Date.now();
      sessionStorage.setItem(KEY, String(startTime));
    } else {
      startTime = parseInt(startTime, 10);
    }

    const update = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, DURATION - elapsed);
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;

      const el = this.shadowRoot.getElementById('cart-countdown');
      if (el) {
        el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }

      if (remaining <= 0) clearInterval(this.timerInterval);
    };

    update();
    this.timerInterval = setInterval(update, 1000);
  }

  disconnectedCallback() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}

customElements.define('promo-banner', PromoBanner);
