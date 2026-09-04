/* ============================================================
   STRATA PROPERTY INTELLIGENCE — PROTOTYPE V2
   Wave 1: data load, state, router, E01, A01, P00.

   Blocks: DATA · STATE · RENDER · ACTIONS · ROUTER
   No dependencies. No build step. Everything same-origin.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- DATA ---------------------------------------- */

  var DATA = null;
  var KEY_SESSION = 'strata.v2.session';
  var KEY_STATE   = 'strata.v2.state';

  function load() {
    return fetch('data/prototype.json', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
  }

  /* Dev-only referential integrity walk. Logs dangling references.
     Not a test framework — twenty lines that stop silent data drift. */
  function checkIntegrity(d) {
    var ids = {};
    ['properties', 'assets', 'obligations', 'issues', 'evidence',
     'documents', 'photos', 'owners', 'actions', 'candidates'].forEach(function (k) {
      (d[k] || []).forEach(function (o) { ids[o.id] = k; });
    });
    var problems = [];
    function ref(from, field, id) {
      if (id && !ids[id]) problems.push(from + '.' + field + ' -> ' + id + ' (missing)');
    }
    (d.issues || []).forEach(function (i) {
      ref(i.id, 'propertyId', i.propertyId);
      ref(i.id, 'assetId', i.assetId);
      ref(i.id, 'actionId', i.actionId);
      (i.evidenceIds || []).forEach(function (e) { ref(i.id, 'evidenceIds', e); });
      (i.photoIds || []).forEach(function (p) { ref(i.id, 'photoIds', p); });
    });
    (d.evidence || []).forEach(function (e) {
      ref(e.id, 'issueId', e.issueId); ref(e.id, 'documentId', e.documentId);
    });
    (d.actions || []).forEach(function (a) {
      ref(a.id, 'issueId', a.issueId); ref(a.id, 'ownerId', a.ownerId);
    });
    if (problems.length) console.warn('[data] dangling references:\n  ' + problems.join('\n  '));
    else console.info('[data] referential integrity OK — ' + Object.keys(ids).length + ' objects');
  }

  /* ---------- STATE --------------------------------------- */

  var State = {
    session: null,   // { name, email, enteredAt }
    overlay: {},     // demo mutations, merged over canonical at render time
    route: 'attention',

    read: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) { return fallback; }
    },
    write: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
    },
    drop: function (key) {
      try { localStorage.removeItem(key); } catch (e) { /* private mode */ }
    },

    hydrate: function () {
      this.session = this.read(KEY_SESSION, null);
      this.overlay = this.read(KEY_STATE, {});
    },
    saveOverlay: function () { this.write(KEY_STATE, this.overlay); },

    /* Canonical merged with overlay. Canonical is never mutated. */
    action: function (id) {
      var base = (DATA.actions || []).filter(function (a) { return a.id === id; })[0];
      if (!base) return null;
      var patch = (this.overlay.actions || {})[id] || {};
      return Object.assign({}, base, patch);
    },

    resetDemo: function () {
      this.overlay = {};
      this.drop(KEY_STATE);
    }
  };

  /* ---------- HELPERS ------------------------------------- */

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function icon(name, cls) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', 'ico' + (cls ? ' ' + cls : ''));
    s.setAttribute('aria-hidden', 'true');
    var u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    u.setAttribute('href', 'assets/icons/icons.svg#i-' + name);
    s.appendChild(u);
    return s;
  }
  function money(n) {
    return '$' + n.toLocaleString('en-CA');
  }
  function moneyRange(r) {
    if (!r) return '—';
    var k = function (v) { return v >= 1000 ? Math.round(v / 1000) + 'K' : String(v); };
    return '$' + k(r.low) + '–$' + k(r.high);
  }
  function statusClass(status) {
    return status === 'Good' ? 'good' : status === 'Fair' ? 'fair' : 'poor';
  }

  /* Placeholder used until the generated photographs land.
     See docs/PHOTO_PROMPTS.md. */
  function imageOrPlaceholder(src, alt, label) {
    var wrap = document.createDocumentFragment();
    var img = new Image();
    img.src = src; img.alt = alt || ''; img.loading = 'lazy';
    var ph = el('div', 'img-placeholder');
    ph.appendChild(el('span', null, label || 'Photograph pending'));
    img.addEventListener('error', function () {
      if (img.parentNode) img.parentNode.replaceChild(ph, img);
    });
    wrap.appendChild(img);
    return wrap;
  }

  /* ---------- RENDER: A01 --------------------------------- */

  var HEALTH_ORDER = [
    { key: 'overall',     label: 'Overall' },
    { key: 'compliance',  label: 'Compliance' },
    { key: 'maintenance', label: 'Maintenance' },
    { key: 'money',       label: 'Money' },
    { key: 'evidence',    label: 'Evidence' }
  ];

  function band(v) { return v >= 70 ? 'good' : v >= 50 ? 'fair' : 'poor'; }

  function renderRing(value) {
    var R = 30, C = 2 * Math.PI * R;
    var tone = band(value);
    var stroke = tone === 'good' ? 'var(--good-600)' : tone === 'fair' ? 'var(--fair-600)' : 'var(--poor-500)';
    var wrap = el('div', 'ring');
    wrap.innerHTML =
      '<svg viewBox="0 0 74 74" aria-hidden="true">' +
        '<circle class="ring-track" cx="37" cy="37" r="' + R + '" fill="none" stroke-width="7"/>' +
        '<circle cx="37" cy="37" r="' + R + '" fill="none" stroke-width="7" stroke-linecap="round"' +
        ' stroke="' + stroke + '" stroke-dasharray="' + C + '"' +
        ' stroke-dashoffset="' + (C * (1 - value / 100)) + '"/>' +
      '</svg>';
    wrap.appendChild(el('div', 'ring-value', String(value)));
    return wrap;
  }

  function renderHealth(prop) {
    var host = $('#a01-health');
    host.textContent = '';
    var lowest = HEALTH_ORDER.reduce(function (a, b) {
      return prop.health[b.key] < prop.health[a.key] ? b : a;
    });

    HEALTH_ORDER.forEach(function (h) {
      var v = prop.health[h.key];
      var tone = band(v);
      var item = el('div', 'health-item is-' + tone);
      item.setAttribute('role', 'listitem');
      if (h.key === lowest.key) item.classList.add('is-flagged');

      item.appendChild(renderRing(v));

      var lab = el('div', 'health-label');
      lab.appendChild(document.createTextNode(h.label));
      /* Decision D3: the weakest indicator carries a cue, so status never
         relies on colour alone. */
      if (h.key === lowest.key) lab.appendChild(icon('alert'));
      item.appendChild(lab);

      var sr = el('span', 'sr-only', h.label + ': ' + v + ' out of 100, ' +
        (tone === 'good' ? 'good' : tone === 'fair' ? 'fair' : 'poor') +
        (h.key === lowest.key ? '. Lowest indicator.' : ''));
      item.appendChild(sr);
      host.appendChild(item);
    });
  }

  function renderAttentionList(issues) {
    var host = $('#a01-attn-list');
    host.textContent = '';

    issues.forEach(function (iss) {
      var sev = (iss.severity || 'Low').toLowerCase();
      var btn = el('button', 'attn-item sev-' + sev);
      btn.type = 'button';
      btn.dataset.issue = iss.id;

      var badge = el('span', 'attn-badge');
      badge.appendChild(icon(
        sev === 'high' ? 'alert' : sev === 'medium' ? 'clock' : 'check-circle'
      ));

      if (iss.isHero) {
        btn.classList.add('is-hero');

        var top = el('div', 'hero-top');
        top.appendChild(badge);
        top.appendChild(el('span', 'pill pill-high', iss.severity + ' priority'));
        btn.appendChild(top);

        btn.appendChild(el('div', 'attn-title', iss.title));
        btn.appendChild(el('div', 'attn-reason', iss.oneLineReason));

        var foot = el('div', 'hero-foot');
        var asset = (DATA.assets || []).filter(function (a) { return a.id === iss.assetId; })[0];

        [['property', asset ? asset.shortName : '—'],
         ['calendar', 'Due in ' + iss.dueInDays + ' days'],
         ['evidence', 'Condition ' + (asset ? asset.condition : 'Unknown')],
         ['clock',    moneyRange(iss.exposure) + ' exposure']
        ].forEach(function (pair) {
          var f = el('span', 'hero-fact');
          f.appendChild(icon(pair[0]));
          f.appendChild(el('strong', null, pair[1]));
          foot.appendChild(f);
        });
        btn.appendChild(foot);

        var act = State.action(iss.actionId);
        if (act) {
          var next = el('div', 'hero-next');
          next.appendChild(document.createTextNode('Recommended next action'));
          next.appendChild(el('b', null, act.title));
          btn.appendChild(next);
        }
      } else {
        btn.appendChild(badge);
        var mid = el('div');
        mid.appendChild(el('div', 'attn-title', iss.title));
        if (iss.oneLineReason) mid.appendChild(el('div', 'attn-reason', iss.oneLineReason));
        btn.appendChild(mid);
        btn.appendChild(el('span', 'attn-due', iss.dueLabel || ''));
        btn.appendChild(el('span', 'pill pill-' + sev, iss.severity));
      }

      host.appendChild(btn);
    });
  }

  function renderAreas(prop) {
    /* A01 uses compact bars (9A2 panel 02). */
    var host = $('#a01-areas');
    host.textContent = '';
    prop.areas.forEach(function (a) {
      var row = el('div', 'area-row');
      row.appendChild(el('span', 'area-name', a.name));
      var bar = el('span', 'area-bar');
      var fill = el('span', 'area-fill fill-' + statusClass(a.status));
      fill.style.width = a.pct + '%';
      bar.appendChild(fill);
      row.appendChild(bar);
      row.appendChild(el('span', 'area-pct', a.pct + '%'));
      row.appendChild(el('span', 'sr-only', a.name + ': ' + a.pct + ' percent, ' + a.status));
      host.appendChild(row);
    });
  }

  function renderA01() {
    var prop = DATA.properties[0];
    var issues = DATA.issues.filter(function (i) { return i.propertyId === prop.id; });

    $('#a01-prop-name').textContent = prop.name;
    $('#a01-prop-meta').innerHTML =
      prop.city + '<span class="dot-sep">•</span>' + prop.units + ' Units' +
      '<span class="dot-sep">•</span>Built ' + prop.yearBuilt;
    $('#a01-attn-count').textContent = 'Top Attention (' + issues.length + ')';
    $('#a01-updated').textContent = 'Updated: ' + fmtDate(prop.lastUpdated);

    var bld = $('#a01-building');
    bld.textContent = '';
    bld.appendChild(imageOrPlaceholder(prop.cutoutImage, prop.name + ' exterior',
      'Building image pending'));

    renderHealth(prop);
    renderAttentionList(issues);
    renderAreas(prop);
  }

  /* ---------- RENDER: P00 --------------------------------- */

  function renderP00() {
    var prop = DATA.properties[0];
    $('#p00-name').textContent = prop.name;
    $('#p00-meta').innerHTML = prop.city + '<span class="dot-sep">•</span>' + prop.units + ' Units';
    $('#p00-updated').textContent = 'Last Updated: ' + fmtDate(prop.lastUpdated);

    var ph = $('#p00-photo');
    ph.textContent = '';
    ph.appendChild(imageOrPlaceholder(prop.heroImage, prop.name + ' exterior',
      'Photograph pending — hero-building-exterior.jpg'));

    /* P00 uses percentage chips plus a quality word (9A2 panel 09). */
    var host = $('#p00-areas');
    host.textContent = '';
    prop.areas.forEach(function (a) {
      var k = statusClass(a.status);
      var row = el('div', 'chip-row');
      row.appendChild(el('span', 'chip-name', a.name));
      row.appendChild(el('span', 'chip chip-' + k, a.pct + '%'));
      row.appendChild(el('span', 'chip-word word-' + k, '(' + a.status + ')'));
      host.appendChild(row);
    });

    var facts = $('#p00-facts');
    facts.textContent = '';
    var assets = DATA.assets.filter(function (a) { return a.propertyId === prop.id; });
    var openIssues = DATA.issues.filter(function (i) { return i.propertyId === prop.id; });
    var hero = openIssues.filter(function (i) { return i.isHero; })[0];

    [['Storeys', String(prop.storeys)],
     ['Units', String(prop.units)],
     ['Year built', String(prop.yearBuilt)],
     ['Tracked assets', String(assets.length)],
     ['Open attention', String(openIssues.length)],
     ['Exposure', hero ? moneyRange(hero.exposure) : '—']
    ].forEach(function (p) {
      var d = el('div', 'p00-fact');
      d.appendChild(el('dt', null, p[0]));
      d.appendChild(el('dd', null, p[1]));
      facts.appendChild(d);
    });
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    var p = iso.split('-');
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[parseInt(p[1], 10) - 1] + ' ' + parseInt(p[2], 10) + ', ' + p[0];
  }

  function todayLabel(iso) {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July',
                  'August','September','October','November','December'];
    var d = new Date(iso + 'T00:00:00');
    return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate();
  }

  /* ---------- ACTIONS ------------------------------------- */

  function submitEntry(ev) {
    ev.preventDefault();
    var name  = $('#f-name').value.trim();
    var email = $('#f-email').value.trim();
    var uid   = $('#f-uid').value;

    var errBox = $('#uid-error');
    var errText = $('#uid-error span');
    var uidField = $('#f-uid');

    /* Decision D2: name and email are captured without gating.
       Unique ID is the only blocking field. */
    var expected = DATA.access.uniqueIdValue;
    var ok = DATA.access.caseSensitive
      ? uid === expected
      : uid.toLowerCase() === expected.toLowerCase();

    if (!ok) {
      errText.textContent = uid.trim() === ''
        ? 'Enter the Unique ID you were given.'
        : 'Unique ID not recognised.';
      errBox.hidden = false;
      uidField.setAttribute('aria-invalid', 'true');
      uidField.focus();
      return;
    }

    errBox.hidden = true;
    uidField.removeAttribute('aria-invalid');

    State.session = { name: name, email: email, enteredAt: new Date().toISOString() };
    State.write(KEY_SESSION, State.session);
    enterApp();
    go('attention');
  }

  function enterApp() {
    $('#view-entry').hidden = true;
    $('#view-app').hidden = false;
    var n = (State.session && State.session.name) || '';
    var initials = n.split(/\s+/).filter(Boolean).slice(0, 2)
      .map(function (w) { return w[0].toUpperCase(); }).join('') || '–';
    $('#viewer-initials').textContent = initials;
    $('#btn-viewer').title = n ? 'Signed in as ' + n + ' — exit prototype' : 'Exit prototype';
  }

  function exitApp() {
    State.drop(KEY_SESSION);
    State.session = null;
    $('#view-app').hidden = true;
    $('#view-entry').hidden = false;
    $('#f-uid').value = '';
    $('#f-name').focus();
  }

  function resetDemo() {
    /* Reset restores the canonical baseline but keeps the viewer signed in,
       so a facilitator resetting mid-demo is not thrown back to the gate.
       "Exit prototype" (the viewer button) clears the session. */
    State.resetDemo();
    renderAll();
    go('attention');
  }

  /* ---------- ROUTER -------------------------------------- */

  var ROUTES = ['attention', 'property', 'evidence', 'action'];

  function go(route) {
    if (ROUTES.indexOf(route) === -1) route = 'attention';
    var target = '#/' + route;
    /* Assigning an identical hash fires no hashchange, so apply directly. */
    if (location.hash === target) applyRoute();
    else location.hash = target;
  }

  function applyRoute() {
    var raw = (location.hash || '').replace(/^#\/?/, '').split('/')[0];
    var route = ROUTES.indexOf(raw) !== -1 ? raw : 'attention';
    State.route = route;

    ROUTES.forEach(function (r) {
      var page = $('#page-' + r);
      if (page) page.hidden = (r !== route);
    });
    $$('.rail-btn[data-route]').forEach(function (b) {
      if (b.dataset.route === route) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    if (route === 'property') renderP00();
    $('#main').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function renderAll() {
    renderA01();
    if (State.route === 'property') renderP00();
  }

  /* ---------- BOOT ---------------------------------------- */

  function wire() {
    $('#entry-form').addEventListener('submit', submitEntry);
    $('#f-uid').addEventListener('input', function () {
      $('#uid-error').hidden = true;
      this.removeAttribute('aria-invalid');
    });
    $('#btn-reset').addEventListener('click', resetDemo);
    $('#btn-viewer').addEventListener('click', exitApp);

    document.addEventListener('click', function (e) {
      var nav = e.target.closest('[data-route]');
      if (nav) { go(nav.dataset.route); return; }
      var iss = e.target.closest('[data-issue]');
      if (iss) {
        /* Wave 2 opens the continuous issue workspace here. */
        console.info('[nav] issue selected:', iss.dataset.issue, '— workspace lands in Wave 2');
      }
    });

    window.addEventListener('hashchange', applyRoute);
  }

  function fail(msg) {
    document.body.innerHTML =
      '<div style="max-width:44rem;margin:14vh auto;padding:0 24px;font:15px/1.6 system-ui">' +
      '<h1 style="font-size:20px;margin:0 0 10px">Prototype could not start</h1>' +
      '<p style="color:#475569">' + msg + '</p>' +
      '<p style="color:#475569">This prototype loads <code>data/prototype.json</code> over HTTP. ' +
      'Opening <code>index.html</code> directly from the filesystem will not work. Run:</p>' +
      '<pre style="background:#F1F5F9;padding:12px 14px;border-radius:8px">python -m http.server 8000</pre>' +
      '<p style="color:#475569">then open <a href="http://localhost:8000">http://localhost:8000</a>.</p></div>';
  }

  load().then(function (d) {
    DATA = d;
    checkIntegrity(d);
    State.hydrate();
    $('#a01-eyebrow').textContent = todayLabel(d.meta.demoToday);

    var prop = d.properties[0];
    var photo = $('#entry-photo');
    photo.appendChild(imageOrPlaceholder(prop.heroImage, prop.name + ' exterior at dusk',
      'Photograph pending — hero-building-exterior.jpg'));
    var cap = el('figcaption', null, prop.name + ' — ' + prop.city);
    photo.appendChild(cap);

    wire();
    renderAll();
    if (State.session) { enterApp(); applyRoute(); }
    else { $('#view-entry').hidden = false; }
  }).catch(function (e) {
    console.error(e);
    fail('Could not load the demonstration data (' + e.message + ').');
  });

})();
