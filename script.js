/* ============================================================
   POTA CAFE — script.js
   Cart · WhatsApp · Email · Cursor · Animations · Reveals
   ============================================================ */

// ── CONFIG ────────────────────────────────────────────────────
const CONFIG = {
  whatsappNumber: '9848303515', // Owner's WhatsApp
  cafeEmail:      'hello@potacafe.com',
  cafeName:       'Pota Cafe',
};

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. PAGE LOADER ─────────────────────────────────────── */
  const loader = document.getElementById('page-loader');
  if (loader) {
    const hide = () => setTimeout(() => loader.classList.add('hidden'), 1600);
    if (document.readyState === 'complete') { hide(); }
    else { window.addEventListener('load', hide); }
  }

  /* ── 2. CUSTOM CURSOR ──────────────────────────────────── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring && window.innerWidth > 768) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });
    (function animateCursor() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateCursor);
    })();
    document.querySelectorAll('a, button, .menu-card, .gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── 3. NAVIGATION ──────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 4. ACTIVE NAV ──────────────────────────────────────── */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  /* ── 5. MOBILE MENU ─────────────────────────────────────── */
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const bars = hamburger.querySelectorAll('span');
      const isOpen = mobileMenu.classList.contains('open');
      bars[0].style.transform = isOpen ? 'translateY(6.5px) rotate(45deg)' : '';
      bars[1].style.opacity   = isOpen ? '0' : '';
      bars[2].style.transform = isOpen ? 'translateY(-6.5px) rotate(-45deg)' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = ''; s.style.opacity = '';
        });
      });
    });
  }

  /* ── 6. SCROLL REVEAL ───────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => obs.observe(el));
  }

  /* ── 7. SECTION LINES ───────────────────────────────────── */
  document.querySelectorAll('.section-line').forEach(line => {
    new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) line.classList.add('revealed'); });
    }, { threshold: 0.5 }).observe(line);
  });

  /* ── 8. PARALLAX HERO ───────────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.35}px) scale(1)`;
    }, { passive: true });
  }

  /* ── 9. 3D CARD TILT ────────────────────────────────────── */
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const x   = e.clientX - r.left;
      const y   = e.clientY - r.top;
      const rX  = ((y - r.height / 2) / r.height) * -7;
      const rY  = ((x - r.width  / 2) / r.width)  *  7;
      card.style.transform    = `translateY(-8px) rotateX(${rX}deg) rotateY(${rY}deg)`;
      card.style.transition   = 'transform 0.08s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    });
  });

  /* ── 10. COUNTER ANIMATION ──────────────────────────────── */
  document.querySelectorAll('[data-count]').forEach(el => {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const end = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let curr = 0;
        const inc = end / (1800 / 16);
        const timer = setInterval(() => {
          curr = Math.min(curr + inc, end);
          el.textContent = Math.floor(curr) + suffix;
          if (curr >= end) clearInterval(timer);
        }, 16);
        e.target._obs?.unobserve(e.target);
      });
    }, { threshold: 0.5 }).observe(el);
  });

  /* ── 11. MENU FILTER ────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        document.querySelectorAll('.menu-card').forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.classList.remove('hidden');
            card.style.animation = 'cardReveal 0.4s ease forwards';
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ── 12. SHOPPING CART ──────────────────────────────────── */
  let cart = [];

  const cartSidebar  = document.getElementById('cart-sidebar');
  const cartOverlay  = document.getElementById('cart-overlay');
  const cartToggle   = document.getElementById('cart-toggle');
  const cartClose    = document.getElementById('cart-close');
  const cartBadge    = document.getElementById('cart-badge');
  const cartItemsEl  = document.getElementById('cart-items');
  const cartTotalEl  = document.getElementById('cart-total-amount');
  const cartEmptyEl  = document.getElementById('cart-empty');

  function openCart() {
    cartSidebar?.classList.add('open');
    cartOverlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartSidebar?.classList.remove('open');
    cartOverlay?.classList.remove('visible');
    document.body.style.overflow = '';
  }

  cartToggle?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  function updateCartUI() {
    if (!cartItemsEl) return;
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

    // Badge
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.classList.toggle('visible', totalItems > 0);
    }
    // Total
    if (cartTotalEl) cartTotalEl.textContent = 'Rs. ' + totalPrice.toLocaleString();

    // Empty state
    if (cartEmptyEl) cartEmptyEl.style.display = cart.length === 0 ? 'block' : 'none';

    // Items
    const existingItems = cartItemsEl.querySelectorAll('.cart-item');
    existingItems.forEach(el => el.remove());

    cart.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img class="cart-item-img" src="${item.img}" alt="${item.name}" />
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">Rs. ${(item.price * item.qty).toLocaleString()}</p>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="dec" data-idx="${idx}">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-idx="${idx}">+</button>
        </div>
        <button class="cart-remove" data-idx="${idx}">✕</button>
      `;
      cartItemsEl.appendChild(el);
    });

    // Qty controls
    cartItemsEl.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        if (btn.dataset.action === 'inc') { cart[idx].qty++; }
        else { cart[idx].qty--; if (cart[idx].qty <= 0) cart.splice(idx, 1); }
        updateCartUI();
      });
    });
    cartItemsEl.querySelectorAll('.cart-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(parseInt(btn.dataset.idx), 1);
        updateCartUI();
      });
    });
  }

  // Add to cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const card  = this.closest('.menu-card');
      const name  = card.querySelector('.menu-card-name')?.textContent || '';
      const price = parseInt(card.querySelector('.menu-card-price')?.textContent.replace(/[^0-9]/g, '') || 0);
      const img   = card.querySelector('img')?.src || '';

      const existing = cart.find(i => i.name === name);
      if (existing) { existing.qty++; }
      else { cart.push({ name, price, img, qty: 1 }); }

      // Button feedback
      this.classList.add('added');
      const orig = this.innerHTML;
      this.innerHTML = '✓ Added';
      setTimeout(() => {
        this.innerHTML = orig;
        this.classList.remove('added');
      }, 1200);

      updateCartUI();
      // Brief cart bounce
      if (cartToggle) {
        cartToggle.style.transform = 'scale(1.3)';
        setTimeout(() => cartToggle.style.transform = '', 300);
      }
    });
  });

  /* ── 13. WHATSAPP ORDER ─────────────────────────────────── */
  document.getElementById('cart-whatsapp')?.addEventListener('click', () => {
    if (cart.length === 0) { alert('Your cart is empty!'); return; }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    let msg = `Hello ${CONFIG.cafeName}! 🍵\n\nI'd like to place an order:\n\n`;
    cart.forEach(item => {
      msg += `• ${item.name} × ${item.qty} = Rs. ${(item.price * item.qty).toLocaleString()}\n`;
    });
    msg += `\n*Total: Rs. ${total.toLocaleString()}*\n\nPlease confirm my order. Thank you!`;
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });

  /* ── 14. EMAIL ORDER ────────────────────────────────────── */
  document.getElementById('cart-email')?.addEventListener('click', () => {
    if (cart.length === 0) { alert('Your cart is empty!'); return; }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    let body = `Hello Pota Cafe!\n\nI would like to place the following order:\n\n`;
    cart.forEach(item => {
      body += `• ${item.name} x${item.qty} = Rs. ${(item.price * item.qty).toLocaleString()}\n`;
    });
    body += `\nOrder Total: Rs. ${total.toLocaleString()}\n\nPlease confirm. Thank you!`;
    const subject = `New Order from Pota Cafe Website`;
    window.location.href = `mailto:${CONFIG.cafeEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  /* ── 15. RESERVATION FORM ───────────────────────────────── */
  const dateInput = document.getElementById('res-date');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  // Form focus micro-interactions
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    const group = input.closest('.form-group');
    input.addEventListener('focus',  () => group?.classList.add('focused'));
    input.addEventListener('blur',   () => group?.classList.remove('focused'));
  });

  // Form submit feedback
  document.querySelectorAll('form[data-feedback]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = '✓  Confirmed!';
      btn.style.background = '#2e7d52';
      btn.style.color = '#fff';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  });

  /* ── 16. GALLERY LIGHTBOX ───────────────────────────────── */
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `<img id="lb-img" /><button id="lb-close">✕ &nbsp;CLOSE</button>`;
  document.body.appendChild(lb);

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      if (!src) return;
      lb.querySelector('#lb-img').src = src;
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
  lb.querySelector('#lb-close').addEventListener('click', () => {
    lb.style.display = 'none';
    document.body.style.overflow = '';
  });
  lb.addEventListener('click', e => {
    if (e.target === lb) { lb.style.display = 'none'; document.body.style.overflow = ''; }
  });

  /* ── 17. MARQUEE PAUSE ──────────────────────────────────── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
    marqueeTrack.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');
  }

  /* ── 18. SMOOTH ANCHOR SCROLL ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── 19. INIT CART UI ───────────────────────────────────── */
  updateCartUI();

});

/* ── Card reveal animation ───────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
