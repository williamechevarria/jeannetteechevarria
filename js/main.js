/* Jeannette Echevarria — interactions */
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav state ---------- */
  const nav = document.getElementById('siteNav');
  const progress = document.getElementById('progressFill');
  const toTop = document.getElementById('toTop');

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    toTop.classList.toggle('is-visible', y > 700);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(y / max) * 100}%` : '0%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    })
  );

  /* ---------- active nav link on scroll ---------- */
  const sections = [...document.querySelectorAll('main section[id]')];
  const navAnchors = [...links.querySelectorAll('a[href^="#"]')];
  const sectionSpy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navAnchors.forEach(a =>
        a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`)
      );
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => sectionSpy.observe(s));

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const ro = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = `${(e.target.dataset.delay || 0)}ms`;
          e.target.classList.add('is-visible');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    // stagger siblings that arrive together
    document.querySelectorAll('.stats__grid, .portfolio__grid, .join__grid, .accolades, .team__grid, .areas__grid')
      .forEach(group => [...group.children].forEach((c, i) => { if (c.classList.contains('reveal')) c.dataset.delay = i * 90; }));
    reveals.forEach(el => ro.observe(el));
  }

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll('.count');
  const runCounter = el => {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (prefersReduced) { el.textContent = prefix + target + suffix; return; }
    const dur = 1600;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => co.observe(c));

  /* ---------- testimonial carousel ---------- */
  const quotes = [...document.querySelectorAll('#carouselViewport .quote')];
  const dotsWrap = document.getElementById('carouselDots');
  let current = 0;
  let timer = null;

  quotes.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); restart(); });
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];

  const goTo = i => {
    current = (i + quotes.length) % quotes.length;
    quotes.forEach((q, j) => q.classList.toggle('is-active', j === current));
    dots.forEach((d, j) => d.classList.toggle('is-active', j === current));
  };
  const restart = () => {
    if (prefersReduced) return;
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 6500);
  };
  document.getElementById('prevQuote').addEventListener('click', () => { goTo(current - 1); restart(); });
  document.getElementById('nextQuote').addEventListener('click', () => { goTo(current + 1); restart(); });

  // swipe support
  const viewport = document.getElementById('carouselViewport');
  let startX = null;
  viewport.addEventListener('pointerdown', e => { startX = e.clientX; }, { passive: true });
  viewport.addEventListener('pointerup', e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 48) { goTo(current + (dx < 0 ? 1 : -1)); restart(); }
    startX = null;
  }, { passive: true });

  goTo(0);
  restart();

  /* ---------- area card tilt ---------- */
  if (!prefersReduced && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -4;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 4;
        card.style.transform = `translateY(-6px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- interactive market map ---------- */
  const mapWrap = document.getElementById('mapWrap');
  if (mapWrap) {
    const NS = 'http://www.w3.org/2000/svg';
    const tooltip = document.getElementById('mapTooltip');
    const svgs = { fl: document.getElementById('mapFL'), va: document.getElementById('mapVA') };
    const pinsGs = { fl: document.getElementById('pinsFL'), va: document.getElementById('pinsVA') };
    const states = {
      fl: document.getElementById('stateFL'),
      va: document.getElementById('stateVA')
    };
    // Fit each state to its own SVG: viewBox = state bbox + padding (extra right for labels)
    Object.entries(states).forEach(([key, path]) => {
      const bb = path.getBBox();
      const padX = bb.width * 0.06, padY = bb.height * 0.10;
      const labelPad = bb.width * 0.22; // room for pin labels on the right
      svgs[key].setAttribute('viewBox',
        `${bb.x - padX} ${bb.y - padY} ${bb.width + padX + labelPad} ${bb.height + padY * 2}`);
    });
    // Pins are placed as fractions of each state's bounding box (x across, y down)
    const MARKETS = [
      { name: 'Tampa', state: 'fl', fx: 0.56, fy: 0.50, home: true,
        blurb: 'Jeannette’s home base — bay-front condos to urban-core bungalows.', tag: 'Home base' },
      { name: 'St. Petersburg', state: 'fl', fx: 0.50, fy: 0.60, labelSide: 'left',
        blurb: 'Waterfront living and a booming arts district across the bay.', tag: 'Gulf coast' },
      { name: 'Sarasota', state: 'fl', fx: 0.57, fy: 0.66,
        blurb: 'Gulf beaches, golf, and luxury communities down the coast.', tag: 'Gulf coast' },
      { name: 'Orlando', state: 'fl', fx: 0.68, fy: 0.42,
        blurb: 'Central Florida growth corridors and investment opportunities.', tag: 'Central FL' },
      { name: 'Miami', state: 'fl', fx: 0.87, fy: 0.82,
        blurb: 'Luxury condos and international buyers in South Florida.', tag: 'South FL' },
      { name: 'Arlington & Alexandria', state: 'va', fx: 0.815, fy: 0.12, label: 'Arlington',
        blurb: 'Inside-the-Beltway favorites for DC commuters.', tag: 'NoVA' },
      { name: 'Woodbridge', state: 'va', fx: 0.79, fy: 0.26, labelSide: 'left',
        blurb: 'Family neighborhoods with room to grow.', tag: 'NoVA' },
      { name: 'Stafford', state: 'va', fx: 0.775, fy: 0.40,
        blurb: 'Military relocation specialty — minutes to Quantico.', tag: 'NoVA' }
    ];
    const pinEls = new Map();
    const listItems = [...document.querySelectorAll('.mgroup li')];

    /* --- market explorer dialog: routes buyers to inventory, sellers to a listing appt --- */
    const LISTINGS = {
      'Miami': [
        { img: 'assets/prop-hallandale.jpg', addr: '2000 South Ocean Dr', loc: 'Hallandale Beach, FL', desc: 'Minotti-furnished half-floor residence at 2000 Ocean.' }
      ],
      'Stafford': [
        { img: 'assets/prop-stafford.jpg', addr: '18 Grassland St', loc: 'Stafford, VA', desc: 'Five bedrooms in Widewater Village with private-entrance lower level.' },
        { img: 'assets/prop-somerset.jpg', addr: '36 Somerset Ln', loc: 'Stafford, VA', desc: '2,184 sqft on a 2.2-acre lot — room to breathe.' },
        { img: 'assets/prop-twinbrook.jpg', addr: '807 Twin Brook Ln', loc: 'Stafford, VA', desc: 'Renovated brick-front townhouse minutes to Quantico.' }
      ],
      'Woodbridge': [
        { img: 'assets/prop-russie.jpg', addr: '3325 Russie Run Rd', loc: 'Locust Grove, VA', desc: 'Charming Cape Cod — 4 bedrooms, 3 full baths.' }
      ]
    };
    const modal = document.getElementById('marketModal');
    const mmTitle = document.getElementById('mmTitle');
    const mmTag = document.getElementById('mmTag');
    const mmBlurb = document.getElementById('mmBlurb');
    const mmResults = document.getElementById('mmResults');
    let activeMarket = null;
    let lastFocus = null;

    const prefillContact = (side, message) => {
      const radio = document.querySelector(`#sideToggle input[value="${side}"]`);
      if (radio) radio.checked = true;
      const msg = document.getElementById('message');
      if (msg) msg.value = message;
    };
    const closeModal = () => {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    const openModal = m => {
      activeMarket = m;
      lastFocus = document.activeElement;
      mmTitle.textContent = m.name;
      mmTag.textContent = `${m.tag} · ${m.state === 'fl' ? 'Florida' : 'Virginia'}`;
      mmBlurb.textContent = m.blurb;
      mmResults.innerHTML = '';
      modal.querySelectorAll('.mchoice').forEach(b => b.classList.remove('is-picked'));
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      modal.querySelector('.mchoice').focus();
    };
    modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

    const renderBuy = m => {
      const homes = LISTINGS[m.name] || [];
      mmResults.innerHTML = '';
      if (homes.length) {
        const grid = document.createElement('div');
        grid.className = 'mm-grid';
        homes.forEach(h => {
          const card = document.createElement('a');
          card.className = 'mm-card';
          card.href = '#portfolio';
          card.addEventListener('click', closeModal);
          const im = document.createElement('img'); im.src = h.img; im.alt = h.addr;
          const body = document.createElement('div');
          const t = document.createElement('strong'); t.textContent = h.addr;
          const l = document.createElement('span'); l.textContent = h.loc;
          const d = document.createElement('p'); d.textContent = h.desc;
          body.append(t, l, d);
          card.append(im, body);
          grid.appendChild(card);
        });
        mmResults.appendChild(grid);
      } else {
        const p = document.createElement('p');
        p.className = 'mm-empty';
        p.textContent = `No public listings in ${m.name} this week — new inventory drops constantly, and the best homes often sell before they hit the portals.`;
        mmResults.appendChild(p);
      }
      const cta = document.createElement('button');
      cta.type = 'button';
      cta.className = 'btn btn--solid mm-cta';
      cta.textContent = homes.length ? `Get every ${m.name} listing` : `Get first access in ${m.name}`;
      cta.addEventListener('click', () => {
        prefillContact('Buying', `Hi Jeannette — I'm buying in ${m.name}. Please send me current and off-market inventory that fits my needs. `);
        closeModal();
        document.getElementById('contact').scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      });
      mmResults.appendChild(cta);
    };
    const renderSell = m => {
      mmResults.innerHTML = '';
      const p = document.createElement('p');
      p.className = 'mm-empty';
      p.textContent = `Thinking of selling in ${m.name}? Jeannette will walk your home, price it against live ${m.state === 'fl' ? 'Florida' : 'Virginia'} comps, and map out a launch plan — no obligation.`;
      const cta = document.createElement('button');
      cta.type = 'button';
      cta.className = 'btn btn--solid mm-cta';
      cta.textContent = 'Schedule my listing appointment';
      cta.addEventListener('click', () => {
        prefillContact('Selling', `Hi Jeannette — I'd like to schedule a listing appointment for my home in ${m.name}. `);
        closeModal();
        document.getElementById('contact').scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      });
      mmResults.append(p, cta);
    };
    modal.querySelectorAll('.mchoice').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.mchoice').forEach(b => b.classList.toggle('is-picked', b === btn));
        if (!activeMarket) return;
        (btn.dataset.intent === 'buy' ? renderBuy : renderSell)(activeMarket);
      });
    });

    const showTip = (m, evt) => {
      tooltip.innerHTML = '';
      const s = document.createElement('strong'); s.textContent = m.name;
      const e = document.createElement('em'); e.textContent = m.blurb;
      const t = document.createElement('span'); t.className = 'tt-tag'; t.textContent = m.tag;
      tooltip.append(s, e, t);
      const r = mapWrap.getBoundingClientRect();
      let x = evt.clientX - r.left + 14, y = evt.clientY - r.top - 10;
      x = Math.min(x, r.width - 240);
      tooltip.style.left = `${Math.max(0, x)}px`;
      tooltip.style.top = `${y}px`;
      tooltip.classList.add('is-on');
    };
    const hideTip = () => tooltip.classList.remove('is-on');

    const syncHot = (name, on) => {
      const pin = pinEls.get(name);
      if (pin) pin.classList.toggle('is-hot', on);
      listItems.forEach(li => {
        if (li.dataset.market === name) li.classList.toggle('is-hot', on);
      });
    };

    MARKETS.forEach(m => {
      const bb = states[m.state].getBBox();
      const cx = bb.x + bb.width * m.fx;
      const cy = bb.y + bb.height * m.fy;
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', `map-pin${m.home ? ' is-home' : ''}`);
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', `${m.name} — ${m.blurb}`);
      const hit = document.createElementNS(NS, 'circle');
      hit.setAttribute('class', 'hit'); hit.setAttribute('cx', cx); hit.setAttribute('cy', cy); hit.setAttribute('r', 10);
      const halo = document.createElementNS(NS, 'circle');
      halo.setAttribute('class', 'halo'); halo.setAttribute('cx', cx); halo.setAttribute('cy', cy); halo.setAttribute('r', 4);
      const core = document.createElementNS(NS, 'circle');
      core.setAttribute('class', 'core'); core.setAttribute('cx', cx); core.setAttribute('cy', cy); core.setAttribute('r', 4);
      const label = document.createElementNS(NS, 'text');
      if (m.labelSide === 'left') {
        label.setAttribute('x', cx - 8); label.setAttribute('text-anchor', 'end');
      } else {
        label.setAttribute('x', cx + 8);
      }
      label.setAttribute('y', cy + 3);
      label.textContent = m.label || m.name;
      g.append(hit, halo, core, label);
      pinsGs[m.state].appendChild(g);
      pinEls.set(m.name, g);

      g.addEventListener('mousemove', e => { showTip(m, e); syncHot(m.name, true); });
      g.addEventListener('mouseleave', () => { hideTip(); syncHot(m.name, false); });
      g.addEventListener('focus', () => syncHot(m.name, true));
      g.addEventListener('blur', () => { hideTip(); syncHot(m.name, false); });
      const explore = () => { hideTip(); openModal(m); };
      g.addEventListener('click', explore);
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); explore(); } });
    });

    // state hover <-> list group sync
    Object.entries(states).forEach(([key, path]) => {
      const group = document.getElementById(`mgroup${key.toUpperCase()}`);
      path.addEventListener('mouseenter', () => group.classList.add('is-hot'));
      path.addEventListener('mouseleave', () => group.classList.remove('is-hot'));
      group.addEventListener('mouseenter', () => path.classList.add('is-hot'));
      group.addEventListener('mouseleave', () => path.classList.remove('is-hot'));
    });

    // list item hover -> pin highlight + tooltip anchored to pin
    listItems.forEach(li => {
      const name = li.dataset.market;
      li.addEventListener('mouseenter', () => {
        syncHot(name, true);
        const pin = pinEls.get(name);
        const m = MARKETS.find(x => x.name === name);
        if (pin && m) {
          const core = pin.querySelector('.core');
          const pr = core.getBoundingClientRect();
          showTip(m, { clientX: pr.left + pr.width / 2, clientY: pr.top });
        }
      });
      li.addEventListener('mouseleave', () => { syncHot(name, false); hideTip(); });
      li.setAttribute('tabindex', '0');
      li.setAttribute('role', 'button');
      const explore = () => {
        hideTip();
        const m = MARKETS.find(x => x.name === name);
        if (m) openModal(m);
      };
      li.addEventListener('click', explore);
      li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); explore(); } });
    });
  }

  /* ---------- MLS search (routes to contact until IDX is connected) ---------- */
  const mls = document.getElementById('mlsSearch');
  if (mls) {
    mls.addEventListener('submit', e => {
      e.preventDefault();
      const d = new FormData(mls);
      const parts = [];
      if (String(d.get('sLoc') || '').trim()) parts.push(`Location: ${d.get('sLoc')}`);
      if (d.get('sType') && d.get('sType') !== 'Any type') parts.push(`Type: ${d.get('sType')}`);
      if (d.get('sBeds') && d.get('sBeds') !== 'Any') parts.push(`Beds: ${d.get('sBeds')}`);
      if (d.get('sPrice') && d.get('sPrice') !== 'No max') parts.push(`Max price: ${d.get('sPrice')}`);
      const msg = document.getElementById('message');
      if (msg) {
        msg.value = `Hi Jeannette — please send me listings matching:\n${parts.length ? parts.join('\n') : 'Open to suggestions — surprise me!'}`;
      }
      const buying = document.querySelector('#sideToggle input[value="Buying"]');
      if (buying) buying.checked = true;
      document.getElementById('searchNote').textContent =
        'Great — finish sending your criteria below and Jeannette will curate your matches.';
      document.getElementById('contact').scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- contact form (mailto handoff) ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const required = ['fname', 'email', 'message'];
    const missing = required.filter(k => !String(data.get(k) || '').trim());
    if (missing.length) {
      note.textContent = 'Please fill in your first name, email, and message.';
      note.style.color = '#c0392b';
      return;
    }
    const subject = encodeURIComponent(`Website inquiry — ${data.get('side')} — ${data.get('fname')} ${data.get('lname') || ''}`.trim());
    const body = encodeURIComponent(
      `Name: ${data.get('fname')} ${data.get('lname') || ''}\n` +
      `Email: ${data.get('email')}\n` +
      `Interested in: ${data.get('side')}\n\n${data.get('message')}`
    );
    window.location.href = `mailto:jeannette@jmeelite.com?subject=${subject}&body=${body}`;
    note.style.color = '';
    note.textContent = 'Opening your email app — your message is ready to send.';
  });

  /* ---------- social marquee (duplicate cards for seamless loop) ---------- */
  const socialTrack = document.querySelector('.social-track');
  if (socialTrack) {
    [...socialTrack.children].forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.tabIndex = -1;
      socialTrack.appendChild(clone);
    });
  }

  /* ---------- footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
