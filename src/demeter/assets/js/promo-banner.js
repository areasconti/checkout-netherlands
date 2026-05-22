/**
 * <promo-banner> — Winkelwagen reservering countdown banner
 *
 * Toont een eenvoudige balk met een aftellende timer (19 minuten).
 * De starttijd wordt opgeslagen in sessionStorage zodat de timer
 * doorloopt bij het vernieuwen van de pagina.
 *
 * ─── GEBRUIK ─────────────────────────────────────────────────────────────────
 *
 *   <promo-banner></promo-banner>
 *
 * ─── URL PARAMS ───────────────────────────────────────────────────────────────
 *
 *   ?banner=n   Verberg de gehele bannersectie (SDK-niveau, op de wrapper-div).
 *
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
        :host {
          display: block;
          font-family: inherit;
        }

        .cart-banner {
          background-color: var(--brand--color--primary, #5469d4);
          padding: 10px 16px;
          text-align: center;
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          line-height: 1.3;
        }

        .cart-countdown {
          background-color: rgba(255, 255, 255, 0.22);
          border-radius: 6px;
          padding: 2px 11px;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        @media (max-width: 600px) {
          .cart-banner {
            font-size: 13px;
            padding: 8px 12px;
            gap: 5px;
          }
        }
      </style>

      <div class="cart-banner">
        <span>🛒 Uw winkelwagen &amp; korting zijn gereserveerd — nog</span>
        <span class="cart-countdown" id="cart-countdown">19:00</span>
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

      if (remaining <= 0) {
        clearInterval(this.timerInterval);
      }
    };

    update();
    this.timerInterval = setInterval(update, 1000);
  }

  disconnectedCallback() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}

customElements.define('promo-banner', PromoBanner);
