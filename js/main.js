/*
const API_BASE = window.__API_BASE__ || 'http://localhost:5000';
async function apiFetch(path, opts = {}) {
  const headers = opts.headers || {};
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = 'Bearer ' + token;
  opts.headers = headers;
  const res = await fetch(API_BASE + path, opts);
  if (!res.ok) {
    const t = await res.text();
    let parsed;
    try { parsed = JSON.parse(t); } catch(e){ parsed = { message: t }; }
    throw parsed;
  }
  return res.json();
}
const SITE_CONTACT = {
  email: "info@globaltrust.example.com",
  phone: "+234123456789",
  facebook: "https://facebook.com/yourpage",
  twitter: "https://twitter.com/yourpage",
  linkedin: "https://linkedin.com/yourpage"
};
document.addEventListener('DOMContentLoaded', function(){
  const emailEl = document.getElementById('contact-email');
  const phoneEl = document.getElementById('contact-phone');
  const fb = document.getElementById('social-facebook');
  const tw = document.getElementById('social-twitter');
  const ln = document.getElementById('social-linkedin');
  if(emailEl) { emailEl.href = 'mailto:' + SITE_CONTACT.email; emailEl.textContent = SITE_CONTACT.email; }
  if(phoneEl) { phoneEl.href = 'tel:' + SITE_CONTACT.phone; phoneEl.textContent = SITE_CONTACT.phone; }
  if(fb) fb.href = SITE_CONTACT.facebook;
  if(tw) tw.href = SITE_CONTACT.twitter;
  if(ln) ln.href = SITE_CONTACT.linkedin;
});*/


// --- Forms wiring --- (add to assets/js/main.js or new asset file)
document.addEventListener('DOMContentLoaded', () => {
  // ------- Investment form ----------
  const investForm = document.getElementById('investmentForm');
  const investList = document.getElementById('investmentList');

  if (investForm) {
    investForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById('invest_name').value.trim(),
        email: document.getElementById('invest_email').value.trim(),
        plan: document.getElementById('invest_plan').value,
        amount: parseFloat(document.getElementById('invest_amount').value),
        note: document.getElementById('invest_note').value.trim()
      };
      try {
        const res = await apiFetch('/api/investments/apply', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        alert(res.message || 'Application submitted');
        // refresh list
        loadInvestmentApplications();
        investForm.reset();
      } catch (err) {
        console.error(err);
        alert(err.message || 'Error submitting application');
      }
    });
    // Load existing
    loadInvestmentApplications();
  }

  async function loadInvestmentApplications() {
    try {
      const list = await apiFetch('/api/investments/my-applications', { method: 'GET' });
      if (!Array.isArray(list)) { investList.innerHTML = 'No applications'; return; }
      investList.innerHTML = list.map(i => `<div class="inv-card"><strong>${i.plan}</strong> — ₦${i.amount.toLocaleString()} — ${i.status}</div>`).join('');
    } catch (err) {
      console.warn('no apps', err);
      investList.innerHTML = 'No applications';
    }
  }

  // ------- Internal transfer ----------
  const internalForm = document.getElementById('internalTransferForm');
  if (internalForm) {
    internalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        recipientEmail: document.getElementById('t_recipient').value.trim(),
        amount: parseFloat(document.getElementById('t_amount').value)
      };
      try {
        const res = await apiFetch('/api/wallet/transfer', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        alert(res.message || 'Transfer successful');
        updateRecentTransactions();
        internalForm.reset();
      } catch (err) {
        console.error(err);
        alert(err.message || 'Transfer failed');
      }
    });
  }

  // ------- Recent transactions (simple) ----------
  async function updateRecentTransactions() {
    try {
      const data = await apiFetch('/api/transactions/recent', { method: 'GET' });
      const container = document.getElementById('recentTransactions');
      if (!data || data.length === 0) { container.innerHTML = 'No recent transactions.'; return; }
      container.innerHTML = data.map(t => `<div>${t.type} ₦${t.amount} — ${new Date(t.createdAt).toLocaleString()}</div>`).join('');
    } catch (err) {
      console.warn('tx fetch error', err);
    }
  }
  updateRecentTransactions();

  // ------- Card payments via Stripe Elements (frontend) ----------
  // NOTE: you must include Stripe.js via <script src="https://js.stripe.com/v3/"></script> in the page head for this to work.
  const cardPayBtn = document.getElementById('cardPayBtn');
  if (cardPayBtn) {
    // initialize Stripe client when page loads
    (async function initStripe() {
      if (typeof Stripe === 'undefined') {
        console.warn('Stripe.js not loaded. Add <script src="https://js.stripe.com/v3/"></script>');
        return;
      }
      // fetch publishable key from backend (optional) or set in env when building frontend
      let publishableKey = window.STRIPE_PUBLISHABLE_KEY || null;
      if (!publishableKey) {
        try {
          const cfg = await apiFetch('/api/payments/stripe-config', { method: 'GET' });
          publishableKey = cfg.publishableKey;
        } catch (err) {
          console.error('Stripe key fetch failed', err);
        }
      }
      if (!publishableKey) return;

      const stripe = Stripe(publishableKey);
      const elements = stripe.elements();
      const card = elements.create('card');
      card.mount('#card-element');

      cardPayBtn.addEventListener('click', async (ev) => {
        ev.preventDefault();
        cardPayBtn.disabled = true;
        try {
          // create payment intent on server
          const orderRes = await apiFetch('/api/payments/create-payment-intent', {
            method: 'POST',
            body: JSON.stringify({ currency: 'ngn', amount: Math.round((document.getElementById('t_amount').value||0)*100) })
          });
          const clientSecret = orderRes.clientSecret;
          const confirmRes = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card }
          });
          if (confirmRes.error) {
            throw confirmRes.error;
          }
          // payment succeeded
          document.getElementById('card-result').textContent = 'Payment successful';
          // optionally notify backend: credit wallet
          await apiFetch('/api/wallet/deposit', {
            method: 'POST',
            body: JSON.stringify({ amount: parseFloat(document.getElementById('t_amount').value) })
          });
          updateRecentTransactions();
        } catch (err) {
          console.error(err);
          document.getElementById('card-result').textContent = err.message || 'Payment failed';
        } finally {
          cardPayBtn.disabled = false;
        }
      });
    })();
  }
});