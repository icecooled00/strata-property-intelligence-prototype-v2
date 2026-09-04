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
    issueId: null,   // the narrative anchor — the selected material issue

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

  /* ---------- RENDER: ISSUE WORKSPACE (IW01–IW03) --------- */

  function byId(coll, id) {
    if (!id) return null;
    return (DATA[coll] || []).filter(function (o) { return o.id === id; })[0] || null;
  }
  function estateKey(s) { return String(s || 'Unknown').toLowerCase().replace(/[^a-z]/g, ''); }
  function estateIcon(s) {
    var k = estateKey(s);
    return k === 'verified' ? 'check-circle'
         : k === 'needsreview' ? 'clock'
         : k === 'conflicting' ? 'alert'
         : k === 'missing' ? 'minus-circle'
         : 'help-dot';
  }
  function estateBadge(s) {
    var n = el('span', 'estate estate-' + estateKey(s));
    n.appendChild(icon(estateIcon(s)));
    n.appendChild(document.createTextNode(s));
    return n;
  }
  function qualityTone(pct) { return pct >= 70 ? 'good' : pct >= 50 ? 'fair' : 'poor'; }

  function timeline(issue) {
    var wrap = el('div', 'timeline');
    var track = el('div', 'tl-track');
    var nodes = (issue.history || []).slice(0, 2).map(function (h) {
      return { big: h.date.slice(0, 4), small: h.label, cls: '' };
    });

    /* The primary supporting evidence is the "latest verification" the
       timeline reports on, not the oldest record attached to the issue. */
    var primary = (issue.evidenceIds || [])
      .map(function (id) { return byId('evidence', id); })
      .filter(function (e) { return e && e.ageLabel; })[0];

    nodes.push({ big: 'Now', small: 'Latest verification', cls: 'is-now',
                 note: primary ? primary.ageLabel : null });

    /* Not every issue has a deadline. Print a real one or none at all. */
    var obl = byId('obligations', issue.obligationId);
    var dueSmall = obl ? obl.title : 'Next due';
    if (issue.dueInDays != null) {
      nodes.push({ big: 'Due in ' + issue.dueInDays + ' days', small: dueSmall,
                   cls: 'is-future is-due' });
    } else if (issue.dueDate) {
      nodes.push({ big: fmtDate(issue.dueDate), small: dueSmall, cls: 'is-future is-due' });
    }

    /* A single marker is not a timeline. */
    if (nodes.length < 2) return null;

    nodes.forEach(function (n) {
      var node = el('div', 'tl-node ' + n.cls);
      node.appendChild(el('div', 'tl-big', n.big));
      node.appendChild(el('div', 'tl-small', n.small));
      node.appendChild(el('div', 'tl-dot'));
      if (n.note) node.appendChild(el('div', 'tl-note', n.note));
      track.appendChild(node);
    });
    wrap.appendChild(track);
    return wrap;
  }

  function riskChart(issue) {
    var d = issue.actNowVsDefer;
    if (!d) return null;
    var W = 440, H = 168, L = 46, R = 16, T = 16, B = 38;
    var n = d.labels.length;
    var x = function (i) { return L + i * (W - L - R) / (n - 1); };
    var y = function (v) { return T + (100 - v) / 100 * (H - T - B); };
    var pts = function (arr) {
      return arr.map(function (v, i) { return x(i) + ',' + y(v); }).join(' ');
    };

    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' +
      'Relative risk over time. Acting now reduces risk; deferring increases it.">';
    [100, 0].forEach(function (v) {
      s += '<line x1="' + L + '" y1="' + y(v) + '" x2="' + (W - R) + '" y2="' + y(v) +
           '" stroke="#E4E9F0" stroke-width="1"/>';
    });
    s += '<text x="' + (L - 10) + '" y="' + (y(100) + 4) + '" text-anchor="end" font-size="11" fill="#64748B">High</text>';
    s += '<text x="' + (L - 10) + '" y="' + (y(0) + 4) + '" text-anchor="end" font-size="11" fill="#64748B">Low</text>';
    d.labels.forEach(function (lb, i) {
      s += '<text x="' + x(i) + '" y="' + (H - 12) + '" text-anchor="middle" font-size="11" fill="#64748B">' + lb + '</text>';
    });
    s += '<polyline fill="none" stroke="#E80000" stroke-width="2.5" stroke-dasharray="7 5" ' +
         'stroke-linecap="round" stroke-linejoin="round" points="' + pts(d.defer) + '"/>';
    s += '<polyline fill="none" stroke="#2E9C63" stroke-width="2.5" ' +
         'stroke-linecap="round" stroke-linejoin="round" points="' + pts(d.actNow) + '"/>';
    s += '<circle cx="' + x(n - 1) + '" cy="' + y(d.defer[n - 1]) + '" r="4.5" fill="#E80000"/>';
    s += '<circle cx="' + x(n - 1) + '" cy="' + y(d.actNow[n - 1]) + '" r="4.5" fill="#2E9C63"/>';
    s += '</svg>';

    var wrap = el('div', 'riskchart');
    wrap.innerHTML = s;
    var lg = el('div', 'rc-legend');
    [['now', 'Act now'], ['defer', 'Defer']].forEach(function (p) {
      var k = el('div', 'rc-key');
      k.appendChild(el('span', 'rc-swatch ' + p[0]));
      k.appendChild(el('span', null, p[1]));
      lg.appendChild(k);
    });
    wrap.appendChild(lg);
    return wrap;
  }

  function photoThumb(photo, small) {
    var b = el('button', 'pthumb');
    b.type = 'button';
    b.dataset.photo = photo.id;
    b.title = photo.caption;
    b.appendChild(imageOrPlaceholder(photo.src, photo.alt, small ? 'Photo pending' : 'Photo pending'));
    return b;
  }

  function renderIW01(issue) {
    var host = $('#iw01'); host.textContent = '';
    var asset = byId('assets', issue.assetId);
    var obl = byId('obligations', issue.obligationId);
    var photos = (issue.photoIds || []).map(function (id) { return byId('photos', id); }).filter(Boolean);

    /* Why this matters + on-demand explanation (F05) */
    var b1 = el('div', 'block');
    var whyText = issue.whyItMatters || issue.oneLineReason;
    if (whyText) {
      b1.appendChild(el('h2', null, 'Why this matters'));
      b1.appendChild(el('p', 'prose', whyText));
    }

    /* F06: 1–2 thumbnails here; the fuller set lives in Evidence. */
    if (photos.length) {
      var strip = el('div', 'photostrip');
      strip.style.marginTop = '14px';
      photos.slice(0, 2).forEach(function (p) { strip.appendChild(photoThumb(p, true)); });
      b1.appendChild(strip);
    }

    if (issue.consequence || issue.uncertainty) {
      var ex = el('details', 'explain');
      var sm = el('summary');
      sm.appendChild(icon('question'));
      sm.appendChild(document.createTextNode('What does this mean?'));
      ex.appendChild(sm);
      var exb = el('div', 'explain-body');
      if (issue.consequence) exb.appendChild(el('p', null, issue.consequence));
      if (issue.uncertainty) {
        var unc = el('p');
        unc.style.marginTop = issue.consequence ? '8px' : '0';
        unc.appendChild(el('b', null, 'Uncertainty: '));
        unc.appendChild(document.createTextNode(issue.uncertainty));
        exb.appendChild(unc);
      }
      ex.appendChild(exb);
      b1.appendChild(ex);
    }
    if (b1.childNodes.length) host.appendChild(b1);

    /* Context facts */
    var b2 = el('div', 'block');
    b2.appendChild(el('h2', null, 'Context'));
    var dl = el('dl');
    var rows = [
      ['Property', byId('properties', issue.propertyId).name],
      ['Asset / system', asset ? asset.name : '—'],
      ['Obligation', obl ? obl.title + ' · ' + obl.authority : '—'],
      /* Only assert a condition when there is an asset to have one. */
      ['Current condition', asset ? asset.condition : '—'],
      ['Repair exposure', moneyRange(issue.exposure) +
        (issue.exposure ? '  (' + issue.exposure.confidence.toLowerCase() + ' confidence)' : '')]
    ];
    if (issue.funding) {
      rows.push(['Reserve context', money(issue.funding.reserveBalance) + ' balance · ' +
        money(issue.funding.allocated) + ' allocated to envelope']);
    }
    rows.forEach(function (r) {
      var d = el('div', 'arow');
      d.appendChild(el('dt', null, r[0]));
      d.appendChild(el('dd', null, r[1]));
      dl.appendChild(d);
    });
    b2.appendChild(dl);
    host.appendChild(b2);

    /* Timeline */
    var tl = timeline(issue);
    if (tl) {
      var b3 = el('div', 'block');
      b3.appendChild(el('h2', null, 'History and timing'));
      b3.appendChild(tl);
      host.appendChild(b3);
    }

    /* Act now vs defer */
    var chart = riskChart(issue);
    if (chart) {
      var b4 = el('div', 'block');
      b4.appendChild(el('h2', null, 'Act now vs defer risk'));
      b4.appendChild(chart);
      host.appendChild(b4);
    }
  }

  var EV_TAB = 'photos';

  function renderIW02(issue) {
    var host = $('#iw02'); host.textContent = '';
    var evidence = (issue.evidenceIds || []).map(function (id) { return byId('evidence', id); }).filter(Boolean);
    var photos = (issue.photoIds || []).map(function (id) { return byId('photos', id); }).filter(Boolean);

    /* Tabs */
    var tabs = el('div', 'tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Evidence views');
    [['photos', 'Inspection Photos'], ['documents', 'Documents'],
     ['history', 'History'], ['notes', 'Notes']].forEach(function (t) {
      var b = el('button', 'tab', t[1]);
      var selected = EV_TAB === t[0];
      b.type = 'button'; b.dataset.evtab = t[0];
      b.id = 'evtab-' + t[0];
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(selected));
      b.setAttribute('aria-controls', 'evpanel');
      /* Only the selected tab is a tab stop; arrow keys move between them. */
      b.tabIndex = selected ? 0 : -1;
      tabs.appendChild(b);
    });
    host.appendChild(tabs);

    /* Tab panel */
    var panel = el('div', 'block');
    panel.id = 'evpanel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', 'evtab-' + EV_TAB);
    panel.tabIndex = 0;
    if (EV_TAB === 'photos') {
      if (photos.length) {
        var strip = el('div', 'photostrip');
        var SHOWN = 4;
        photos.slice(0, SHOWN).forEach(function (p) { strip.appendChild(photoThumb(p)); });
        if (photos.length > SHOWN) {
          strip.appendChild(el('div', 'pthumb pthumb-more', '+' + (photos.length - SHOWN)));
        }
        panel.appendChild(strip);
      } else {
        panel.appendChild(el('p', 'prose', 'No inspection photographs on file for this issue.'));
      }
    } else if (EV_TAB === 'documents') {
      var docs = evidence.filter(function (e) { return e.documentId; });
      var dl2 = el('div', 'srclist');
      docs.forEach(function (e) { dl2.appendChild(sourceRow(e)); });
      panel.appendChild(docs.length ? dl2 : el('p', 'prose', 'No documents linked.'));
    } else if (EV_TAB === 'history') {
      var ul = el('div');
      (issue.history || []).forEach(function (h) {
        var r = el('div', 'arow');
        r.appendChild(el('dt', null, fmtDate(h.date)));
        var dd = el('dd');
        dd.appendChild(el('div', null, h.label));
        dd.appendChild(el('div', 'srcsnip', h.detail));
        r.appendChild(dd);
        ul.appendChild(r);
      });
      panel.appendChild((issue.history || []).length ? ul : el('p', 'prose', 'No recorded history.'));
    } else {
      panel.appendChild(el('p', 'prose', 'No notes have been added for this issue.'));
    }
    host.appendChild(panel);

    /* Evidence quality — always visible, below the tab panel (9A2 panel 04) */
    var q = (DATA.evidenceQuality || {})[issue.id];
    if (q) {
      var bq = el('div', 'block');
      bq.appendChild(el('h2', null, 'Evidence quality'));
      var row = el('div', 'quality-row');
      var tone = qualityTone(q.pct);
      var word = el('span', 'quality-word q-' + tone);
      word.appendChild(icon(tone === 'good' ? 'check-circle' : tone === 'fair' ? 'clock' : 'alert'));
      word.appendChild(document.createTextNode(q.label));
      row.appendChild(word);
      var bar = el('span', 'quality-bar');
      var fill = el('span', 'quality-fill');
      fill.style.width = q.pct + '%';
      fill.style.background = tone === 'good' ? 'var(--good-600)'
                            : tone === 'fair' ? 'var(--fair-600)' : 'var(--poor-500)';
      bar.appendChild(fill);
      row.appendChild(bar);
      row.appendChild(el('span', 'quality-pct', q.pct + '%'));
      bq.appendChild(row);
      bq.appendChild(el('p', 'quality-why', q.reason));
      host.appendChild(bq);
    }

    /* Sources — every evidence record, including Missing and Unknown */
    var bs = el('div', 'block');
    bs.appendChild(el('h2', null, 'Source'));
    if (evidence.length) {
      var list = el('div', 'srclist');
      evidence.forEach(function (e) { list.appendChild(sourceRow(e)); });
      bs.appendChild(list);
    } else {
      bs.appendChild(el('p', 'prose', 'No source evidence is linked to this item yet.'));
    }
    host.appendChild(bs);
  }

  function sourceRow(e) {
    var doc = byId('documents', e.documentId);
    var row = el('button', 'srcrow');
    row.type = 'button';
    if (doc) row.dataset.doc = doc.id;
    else row.disabled = true;

    row.appendChild(icon('evidence'));
    var mid = el('div');
    mid.appendChild(el('div', 'srcname', doc ? doc.name : e.sourceType));
    mid.appendChild(el('div', 'srcsnip', e.snippet));
    row.appendChild(mid);
    row.appendChild(el('span', 'srcage', e.ageLabel || '—'));
    row.appendChild(estateBadge(e.state));
    return row;
  }

  function renderIW03(issue) {
    var host = $('#iw03'); host.textContent = '';
    var act = State.action(issue.actionId);
    if (!act) {
      host.appendChild(el('div', 'block')).appendChild(
        el('p', 'prose', 'No recommended action has been generated for this issue yet.'));
      return;
    }
    var owner = byId('owners', act.ownerId);
    var bench = DATA.costBenchmark && DATA.costBenchmark.issueId === issue.id ? DATA.costBenchmark : null;

    var b1 = el('div', 'block');
    b1.appendChild(el('p', 'sec-label', 'Recommended action'));
    var h = el('h2', null, act.title);
    h.style.fontSize = '19px';
    h.style.marginBottom = '10px';
    b1.appendChild(h);
    b1.appendChild(el('p', 'prose', act.rationale));
    host.appendChild(b1);

    var b2 = el('div', 'block');
    var dl = el('dl');
    function row(label, value, strong, extra) {
      var d = el('div', 'arow');
      d.appendChild(el('dt', null, label));
      var dd = el('dd', strong ? 'strong' : null);
      if (typeof value === 'string') dd.textContent = value;
      else dd.appendChild(value);
      if (extra) dd.appendChild(el('span', 'conf', extra));
      d.appendChild(dd);
      dl.appendChild(d);
    }
    row('Owner', owner ? owner.name + ' — ' + owner.role : 'Unassigned');
    row('Target date', fmtDate(act.targetDate) + ' (in ' + issue.dueInDays + ' days)');
    row('Est. cost', moneyRange(act.cost), true, act.cost.confidence + ' confidence');

    var badge = el('span', 'status-badge st-' + act.status.toLowerCase().replace(/\s/g, ''));
    badge.appendChild(icon(act.status === 'Completed' ? 'check-circle'
                        : act.status === 'Assigned' ? 'user' : 'clock'));
    badge.appendChild(document.createTextNode(act.status));
    row('Status', badge);
    row('Risk of deferral', act.riskOfDeferral);
    b2.appendChild(dl);
    host.appendChild(b2);

    if (bench) {
      var b3 = el('div', 'block');
      b3.appendChild(el('h2', null, 'Cost context'));
      var p = el('p', 'prose');
      p.innerHTML = 'Local expected range <b>' + moneyRange(bench.expectedRange) + '</b>. ' +
        'One example quote of <b>' + money(bench.exampleQuote.amount) + '</b> from ' +
        (byId('owners', bench.exampleQuote.vendorId) || {}).name +
        ' sits <b>' + bench.verdict + '</b> that range.';
      b3.appendChild(p);
      var note = el('p', 'quality-why', bench.source + '. ' + bench.assumptions +
        ' Confidence: ' + bench.confidence.toLowerCase() + '.');
      b3.appendChild(note);
      host.appendChild(b3);
    }

    var chart2 = riskChart(issue);
    if (chart2) {
      var b4 = el('div', 'block');
      b4.appendChild(el('h2', null, 'Act now vs defer risk'));
      b4.appendChild(chart2);
      host.appendChild(b4);
    }

    /* Primary actions — one dominant primary (F10) */
    var b5 = el('div', 'block');
    b5.appendChild(el('h2', null, 'Primary actions'));
    var pa = el('div', 'primary-actions');
    var assign = el('button', 'btn btn-solid', act.status === 'Recommended' ? 'Assign' : 'Reassign');
    assign.type = 'button'; assign.dataset.act = 'assign';
    var defer = el('button', 'btn', 'Defer');
    defer.type = 'button'; defer.dataset.act = 'defer';
    var summary = el('button', 'btn btn-quiet', 'Open decision summary');
    summary.type = 'button'; summary.dataset.act = 'summary';
    pa.appendChild(assign); pa.appendChild(defer); pa.appendChild(summary);
    b5.appendChild(pa);

    if (act.deferred) {
      var dn = el('div', 'defer-note');
      dn.appendChild(icon('alert'));
      var dtxt = el('div');
      dtxt.innerHTML = '<b>Deferred to ' + fmtDate(act.deferred.until) + '.</b> ' +
        'This issue remains open and still appears in Attention. Reason: ' +
        act.deferred.reason + (act.deferred.note ? ' — ' + act.deferred.note : '');
      dn.appendChild(dtxt);
      b5.appendChild(dn);
    }
    host.appendChild(b5);
  }

  function renderIssue(issueId, section) {
    var issue = byId('issues', issueId) || DATA.issues.filter(function (i) { return i.isHero; })[0];
    if (!issue) return;
    State.issueId = issue.id;

    var prop = byId('properties', issue.propertyId);
    var asset = byId('assets', issue.assetId);
    var sev = (issue.severity || 'Low').toLowerCase();

    /* Breadcrumb — Property > Asset > Issue (S8A §18) */
    var cr = $('#iw-crumb'); cr.textContent = '';
    var bp = el('button', null, prop.name); bp.type = 'button'; bp.dataset.route = 'property';
    cr.appendChild(bp);
    if (asset) {
      cr.appendChild(icon('chevron-right'));
      cr.appendChild(el('span', null, asset.shortName));
    }
    cr.appendChild(icon('chevron-right'));
    cr.appendChild(el('span', 'here', issue.title));

    /* Header */
    var hd = $('#iw-head');
    hd.textContent = '';
    hd.className = 'iw-head sev-' + sev;
    var wrapT = el('div', 'iw-title-wrap');
    var ic = el('span', 'iw-icon');
    ic.appendChild(icon(sev === 'high' ? 'alert' : sev === 'medium' ? 'clock' : 'check-circle'));
    wrapT.appendChild(ic);
    var tt = el('div');
    tt.appendChild(el('h1', 'iw-title', issue.title));
    tt.appendChild(el('p', 'iw-sub',
      (asset ? asset.name + ' · ' : '') + prop.name + ' · ' + prop.city));
    wrapT.appendChild(tt);
    hd.appendChild(wrapT);
    hd.appendChild(el('span', 'pill pill-' + sev, issue.severity + ' priority'));

    EV_TAB = 'photos';   /* the tab is per-issue, not global */
    renderIW01(issue);
    renderIW02(issue);
    renderIW03(issue);
    setAnchor(section);
  }

  var hasBooted = false;

  function setAnchor(section) {
    if (SECTIONS.indexOf(section) === -1) section = 'why';
    $$('.iw-anchor').forEach(function (a) {
      a.setAttribute('aria-current', String(a.dataset.anchor === section));
    });

    /* Animate once the app is running, but land instantly on a cold load:
       a smooth scroll started before images have sized overshoots the target. */
    var behavior = hasBooted ? 'smooth' : 'auto';
    var OFFSET = 62;   /* matches .iw-section scroll-margin-top */

    /* Compute the destination explicitly. scrollIntoView resolves against
       whatever the layout happens to be mid-load, which overshoots. */
    function doScroll(how) {
      if (section === 'why') { window.scrollTo({ top: 0, behavior: how }); return; }
      var target = document.getElementById('sec-' + section);
      if (!target) return;
      var y = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: Math.max(0, Math.min(y, max)), behavior: how });
    }

    if (hasBooted) { doScroll(behavior); return; }

    /* Cold load: position once the page has settled, then correct again in
       case a late image shifted the layout under us. */
    function settle() {
      requestAnimationFrame(function () {
        doScroll('auto');
        setTimeout(function () { doScroll('auto'); }, 300);
      });
    }
    if (document.readyState === 'complete') settle();
    else window.addEventListener('load', settle, { once: true });
  }

  /* ---------- RENDER: R01 DECISION SUMMARY ---------------- */

  function renderR01(issueId) {
    var issue = byId('issues', issueId) || byId('issues', heroIssueId());
    if (!issue) return;
    State.issueId = issue.id;

    var prop = byId('properties', issue.propertyId);
    var asset = byId('assets', issue.assetId);
    var act = State.action(issue.actionId);
    var owner = act ? byId('owners', act.ownerId) : null;
    var q = (DATA.evidenceQuality || {})[issue.id];
    var bench = DATA.costBenchmark && DATA.costBenchmark.issueId === issue.id ? DATA.costBenchmark : null;
    var evidence = (issue.evidenceIds || []).map(function (id) { return byId('evidence', id); }).filter(Boolean);
    var cr = $('#r01-crumb'); cr.textContent = '';
    var back = el('button', null, 'Back to issue');
    back.type = 'button'; back.dataset.act = 'back-to-issue';
    cr.appendChild(back);
    cr.appendChild(icon('chevron-right'));
    cr.appendChild(el('span', 'here', 'Decision summary'));

    $('#r01-sub').textContent = prop.name + ' · ' + prop.city + ' · prepared ' + fmtDate(DATA.meta.demoToday);

    var host = $('#r01'); host.textContent = '';

    /* 1 — the explicit decision required (F08 leads with this) */
    var dec = el('div', 'r01-decision');
    dec.appendChild(el('p', 'lbl', 'Decision required'));
    /* Only state a decision when there is one. An issue with no recommended
       action has nothing to put to a board yet, and saying otherwise would be
       a false claim in a document meant for governance. */
    if (act) {
      var sentence = act.title + ' at ' + moneyRange(act.cost);
      if (issue.dueDate) sentence += ', to be completed before ' + fmtDate(issue.dueDate);
      dec.appendChild(el('h2', null, sentence + '.'));
    } else {
      dec.querySelector('.lbl').textContent = 'No decision required yet';
      dec.appendChild(el('h2', null,
        'This issue has no recommended action. It is included for awareness ' +
        'while the evidence is reconciled.'));
    }
    dec.appendChild(el('p', 'ctx',
      (asset ? asset.name + ' · ' : '') + 'Current condition ' +
      (asset ? asset.condition : 'Unknown') + ' · ' + issue.severity + ' priority'));
    host.appendChild(dec);

    /* 2 — urgency / evidence / cost, scannable at a glance */
    var tiles = el('div', 'r01-tiles');
    function tile(cls, k, v, s, warn) {
      var t = el('div', 'r01-tile ' + cls + (warn ? '' : ' is-calm'));
      t.appendChild(el('div', 'k', k));
      t.appendChild(el('div', 'v' + (warn ? ' warn' : ''), v));
      t.appendChild(el('div', 's', s));
      return t;
    }
    var urgencyValue = issue.dueInDays != null ? issue.dueInDays + ' days'
                     : issue.dueDate ? fmtDate(issue.dueDate) : 'No deadline';
    var urgencySub = issue.dueDate ? 'Obligation due ' + fmtDate(issue.dueDate)
                                   : 'No obligation date recorded';
    tiles.appendChild(tile('t-urgency', 'Urgency', urgencyValue, urgencySub,
      issue.dueInDays != null && issue.dueInDays <= 30));
    var primaryEv = evidence.filter(function (e) { return e && e.ageLabel; })[0];
    tiles.appendChild(tile('t-evidence', 'Evidence quality',
      q ? q.label + ' · ' + q.pct + '%' : 'Unknown',
      primaryEv ? 'Latest verification ' + primaryEv.ageLabel : 'No dated verification on file',
      !q || q.pct < 70));
    tiles.appendChild(tile('t-cost', 'Cost',
      act ? moneyRange(act.cost) : 'Not costed',
      issue.exposure ? 'Recommended action. Repair exposure ' + moneyRange(issue.exposure)
                     : 'No costed exposure recorded',
      false));
    host.appendChild(tiles);

    /* 3 — why it matters */
    var why = el('div', 'card');
    var wb = el('div', 'block');
    wb.appendChild(el('h2', null, 'Why this matters'));
    wb.appendChild(el('p', 'prose', issue.whyItMatters));
    var cons = el('p', 'prose');
    cons.style.marginTop = '10px';
    cons.innerHTML = '<b>Consequence of delay:</b> ' + issue.consequence;
    wb.appendChild(cons);
    var unc = el('p', 'quality-why');
    unc.textContent = 'Uncertainty: ' + issue.uncertainty;
    wb.appendChild(unc);
    why.appendChild(wb);

    /* 4 — supporting evidence roll-up */
    var eb = el('div', 'block');
    eb.appendChild(el('h2', null, 'Supporting evidence'));
    var evl = el('div', 'r01-ev');
    evidence.forEach(function (e) {
      var doc = byId('documents', e.documentId);
      var r = el('div', 'r01-evrow');
      r.appendChild(el('span', 'r01-evname', doc ? doc.name : e.sourceType));
      r.appendChild(el('span', 'srcage', e.ageLabel || '—'));
      r.appendChild(estateBadge(e.state));
      evl.appendChild(r);
    });
    eb.appendChild(evl);
    why.appendChild(eb);

    /* Quote benchmark, where the frozen scope allows it */
    if (bench) {
      var bb = el('div', 'block');
      bb.appendChild(el('h2', null, 'Cost benchmark'));
      var bp = el('p', 'prose');
      bp.innerHTML = 'One example quote of <b>' + money(bench.exampleQuote.amount) +
        '</b> sits <b>' + bench.verdict + '</b> the local expected range of <b>' +
        moneyRange(bench.expectedRange) + '</b>.';
      bb.appendChild(bp);
      bb.appendChild(el('p', 'quality-why', bench.source + '. ' + bench.assumptions));
      why.appendChild(bb);
    }
    host.appendChild(why);

    /* 5 — recommended action, in panel 08's compact card form */
    var card = el('div', 'r01-card');
    card.style.marginTop = '16px';
    var hd = el('div', 'hd');
    hd.appendChild(el('h2', null, 'Decision Summary'));
    card.appendChild(hd);

    var kv = el('dl', 'r01-kv');
    function kvrow(k, v, tone) {
      var r = el('div', 'r01-kvrow');
      r.appendChild(el('dt', null, k));
      r.appendChild(el('dd', tone || null, v));
      kv.appendChild(r);
    }
    kvrow('Recommendation', act ? act.title : '—');
    kvrow('Decision', act && act.status !== 'Recommended' ? act.status : 'Awaiting decision',
      act && act.status !== 'Recommended' ? 'pos' : 'neg');
    kvrow('Owner', owner ? owner.name + ' (' + owner.role + ')' : 'Unassigned');
    kvrow('Due date', act ? fmtDate(act.targetDate) : '—');
    kvrow('Est. cost', act ? moneyRange(act.cost) : '—');
    kvrow('Status',
      !act ? 'No action recorded'
           : act.deferred ? 'Deferred — issue remains open' : 'Active',
      !act ? null : act.deferred ? 'neg' : 'pos');
    kvrow('Confidence', act ? act.cost.confidence : '—', act ? 'pos' : null);
    card.appendChild(kv);

    var ft = el('div', 'ft');
    var hist = el('button', 'link-more', 'View full history');
    hist.type = 'button'; hist.dataset.act = 'back-to-issue';
    hist.appendChild(icon('chevron-right'));
    ft.appendChild(hist);
    card.appendChild(ft);
    host.appendChild(card);

    /* 6 — simulated export */
    var exp = el('div', 'r01-export');
    var btn = el('button', 'btn btn-solid', 'Export PDF');
    btn.type = 'button'; btn.dataset.act = 'export';
    exp.appendChild(btn);
    exp.appendChild(el('span', 'note',
      'Simulated. No file is generated and nothing leaves this browser.'));
    host.appendChild(exp);
  }

  /* ---------- ACTIONS ------------------------------------- */

  function setFieldError(fieldId, errorId, message) {
    var field = $('#' + fieldId), box = $('#' + errorId);
    if (message) {
      $('#' + errorId + ' span').textContent = message;
      box.hidden = false;
      field.setAttribute('aria-invalid', 'true');
    } else {
      box.hidden = true;
      field.removeAttribute('aria-invalid');
    }
    return !message;
  }

  function submitEntry(ev) {
    ev.preventDefault();
    var name  = $('#f-name').value.trim();
    var email = $('#f-email').value.trim();
    var uid   = $('#f-uid').value;

    /* Decision D2: Unique ID is the only field checked against a value.
       Name and email are still required to be present, because S5A UC-P01
       requires access to be attributable to a known person — capturing an
       empty string would defeat the research instrumentation. Neither is
       verified beyond presence and basic shape. */
    var okName  = setFieldError('f-name', 'name-error',
      name ? null : 'Enter your name so this session can be attributed.');
    var okEmail = setFieldError('f-email', 'email-error',
      !email ? 'Enter your email address.'
             : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? null
             : 'Enter a valid email address.');

    var expected = DATA.access.uniqueIdValue;
    var matches = DATA.access.caseSensitive
      ? uid === expected
      : uid.toLowerCase() === expected.toLowerCase();
    var okUid = setFieldError('f-uid', 'uid-error',
      matches ? null
              : uid.trim() === '' ? 'Enter the Unique ID you were given.'
                                  : 'Unique ID not recognised.');

    if (!okName || !okEmail || !okUid) {
      var first = !okName ? '#f-name' : !okEmail ? '#f-email' : '#f-uid';
      $(first).focus();
      return;
    }

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

  var PAGES = ['attention', 'property', 'issue', 'summary'];
  var SECTIONS = ['why', 'evidence', 'action'];

  function heroIssueId() {
    var h = DATA.issues.filter(function (i) { return i.isHero; })[0];
    return h ? h.id : DATA.issues[0].id;
  }

  /* The rail's four areas map onto three pages: Evidence and Action are
     sections of the continuous issue workspace, not separate pages (F02). */
  function go(route, issueId, section) {
    var target;
    if (route === 'evidence' || route === 'action') {
      target = '#/issue/' + (issueId || State.issueId || heroIssueId()) + '/' + route;
    } else if (route === 'issue') {
      target = '#/issue/' + (issueId || State.issueId || heroIssueId()) + '/' + (section || 'why');
    } else if (route === 'summary') {
      target = '#/summary/' + (issueId || State.issueId || heroIssueId());
    } else {
      target = '#/' + (PAGES.indexOf(route) !== -1 ? route : 'attention');
    }
    /* Assigning an identical hash fires no hashchange, so apply directly. */
    if (location.hash === target) applyRoute();
    else location.hash = target;
  }

  function applyRoute() {
    var parts = (location.hash || '').replace(/^#\/?/, '').split('/');
    var page = PAGES.indexOf(parts[0]) !== -1 ? parts[0] : 'attention';
    State.route = page;

    PAGES.forEach(function (p) {
      var node = $('#page-' + p);
      if (node) node.hidden = (p !== page);
    });

    /* Rail highlight: the issue workspace lights Evidence or Action when the
       user is in that section, otherwise nothing. */
    var railKey = page === 'issue' ? (SECTIONS.indexOf(parts[2]) > 0 ? parts[2] : null) : page;
    $$('.rail-btn[data-route]').forEach(function (b) {
      if (b.dataset.route === railKey) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });

    if (page === 'property') { renderP00(); window.scrollTo(0, 0); }
    else if (page === 'summary') { window.scrollTo(0, 0); renderR01(parts[1]); }
    else if (page === 'issue') {
      var id = parts[1] || heroIssueId();
      var section = SECTIONS.indexOf(parts[2]) !== -1 ? parts[2] : 'why';
      window.scrollTo(0, 0);
      renderIssue(id, section);
    } else { renderA01(); window.scrollTo(0, 0); }

    $('#main').focus({ preventScroll: true });
  }

  function renderAll() {
    renderA01();
    if (State.route === 'property') renderP00();
    if (State.route === 'issue') renderIssue(State.issueId, 'why');
    if (State.route === 'summary') renderR01(State.issueId);
  }

  /* ---------- BOOT ---------------------------------------- */

  /* Demo mutations write to the overlay, never to canonical data. */
  function patchAction(id, patch) {
    State.overlay.actions = State.overlay.actions || {};
    State.overlay.actions[id] = Object.assign({}, State.overlay.actions[id] || {}, patch);
    State.saveOverlay();
  }

  function openDialog(id) {
    var d = document.getElementById(id);
    if (d && typeof d.showModal === 'function') d.showModal();
  }
  function closeDialog(node) {
    var d = node.closest('dialog');
    if (d) d.close();
  }

  function openAssign(issue) {
    var act = State.action(issue.actionId);
    var owners = (DATA.owners || []).filter(function (o) { return o.kind === 'internal'; });
    var vendors = (DATA.owners || []).filter(function (o) { return o.kind === 'vendor'; });

    var os = $('#as-owner'); os.textContent = '';
    owners.forEach(function (o) {
      var opt = el('option', null, o.name + ' (' + o.role + ')');
      opt.value = o.id;
      if (o.id === act.ownerId) opt.selected = true;
      os.appendChild(opt);
    });
    var vs = $('#as-vendor'); vs.textContent = '';
    vs.appendChild(Object.assign(el('option', null, 'None'), { value: '' }));
    vendors.forEach(function (o) {
      var opt = el('option', null, o.name);
      opt.value = o.id;
      vs.appendChild(opt);
    });
    $('#as-due').value = act.targetDate;
    $('#as-note').value = '';
    openDialog('dlg-assign');
  }

  function openDefer(issue) {
    var rs = $('#df-reason'); rs.textContent = '';
    (DATA.deferReasons || []).forEach(function (r) {
      var opt = el('option', null, r); opt.value = r; rs.appendChild(opt);
    });
    $('#df-until').value = '';
    $('#df-note').value = '';
    $('#df-ack').checked = false;
    openDialog('dlg-defer');
  }

  function openSource(docId, evidenceState) {
    var doc = byId('documents', docId);
    if (!doc) return;
    $('#dlg-source-title').textContent = doc.name;
    var body = $('#dlg-source-body'); body.textContent = '';

    var meta = el('div', 'srcmeta');
    meta.appendChild(el('span', 'srcage', doc.type + ' · ' + fmtDate(doc.date)));
    if (evidenceState) meta.appendChild(estateBadge(evidenceState));
    body.appendChild(meta);

    body.appendChild(el('div', 'doc-page', doc.previewExcerpt));

    var foot = el('div', 'doc-foot');
    foot.appendChild(el('span', null, 'Page 1 of ' + doc.pages));
    foot.appendChild(el('span', null, 'Simulated preview — no document is fetched'));
    body.appendChild(foot);
    openDialog('dlg-source');
  }

  function openPhoto(photoId) {
    var p = byId('photos', photoId);
    if (!p) return;
    $('#dlg-source-title').textContent = p.caption;
    var body = $('#dlg-source-body'); body.textContent = '';
    var wrap = el('div', 'photo-full-wrap');
    wrap.appendChild(imageOrPlaceholder(p.src, p.alt, 'Photograph pending'));
    body.appendChild(wrap);
    var foot = el('div', 'doc-foot');
    foot.appendChild(el('span', null, 'Captured ' + fmtDate(p.capturedAt)));
    foot.appendChild(el('span', null, p.kind + ' photograph'));
    body.appendChild(foot);
    openDialog('dlg-source');
  }

  /* Export is simulated. Nothing is generated and nothing is downloaded —
     the viewer's sandbox would block a real download anyway, and S5A puts
     production document generation out of scope. */
  function simulateExport(btn) {
    var host = btn.parentNode;
    host.textContent = '';
    var done = el('div', 'export-done');
    done.appendChild(icon('check-circle'));
    done.appendChild(document.createTextNode(
      'Decision summary prepared for board circulation.'));
    host.appendChild(done);
    host.appendChild(el('span', 'note',
      'Simulated export — in the product this would produce a PDF.'));
  }

  function currentIssue() {
    return byId('issues', State.issueId) || byId('issues', heroIssueId());
  }

  function wire() {
    $('#entry-form').addEventListener('submit', submitEntry);
    [['f-name','name-error'], ['f-email','email-error'], ['f-uid','uid-error']]
      .forEach(function (pair) {
        $('#' + pair[0]).addEventListener('input', function () {
          $('#' + pair[1]).hidden = true;
          this.removeAttribute('aria-invalid');
        });
      });
    $('#btn-reset').addEventListener('click', resetDemo);
    $('#btn-viewer').addEventListener('click', exitApp);

    document.addEventListener('click', function (e) {
      var t = e.target;

      var close = t.closest('[data-close]');
      if (close) { closeDialog(close); return; }

      var nav = t.closest('[data-route]');
      if (nav) { go(nav.dataset.route); return; }

      var iss = t.closest('[data-issue]');
      if (iss) { go('issue', iss.dataset.issue, 'why'); return; }

      var anchor = t.closest('.iw-anchor');
      if (anchor) {
        go('issue', State.issueId, anchor.dataset.anchor);
        return;
      }

      var tab = t.closest('[data-evtab]');
      if (tab) { EV_TAB = tab.dataset.evtab; renderIW02(currentIssue()); return; }

      var photo = t.closest('[data-photo]');
      if (photo) { openPhoto(photo.dataset.photo); return; }

      var src = t.closest('[data-doc]');
      if (src) {
        var badge = src.querySelector('.estate');
        openSource(src.dataset.doc, badge ? badge.textContent : null);
        return;
      }

      var act = t.closest('[data-act]');
      if (act) {
        var issue = currentIssue();
        if (act.dataset.act === 'assign') openAssign(issue);
        else if (act.dataset.act === 'defer') openDefer(issue);
        else if (act.dataset.act === 'summary') go('summary', issue.id);
        else if (act.dataset.act === 'back-to-issue') go('issue', issue.id, 'action');
        else if (act.dataset.act === 'export') simulateExport(act);
      }
    });

    /* Assign — owner and status change, reconciled everywhere */
    $('#form-assign').addEventListener('submit', function () {
      var issue = currentIssue();
      patchAction(issue.actionId, {
        ownerId: $('#as-owner').value,
        vendorId: $('#as-vendor').value || null,
        targetDate: $('#as-due').value || undefined,
        note: $('#as-note').value || null,
        status: 'Assigned',
        deferred: null
      });
      renderIssue(issue.id, 'action');
    });

    /* Defer — the issue stays open. Completion is never implied. */
    $('#form-defer').addEventListener('submit', function () {
      var issue = currentIssue();
      patchAction(issue.actionId, {
        deferred: {
          until: $('#df-until').value || issue.dueDate,
          reason: $('#df-reason').value,
          note: $('#df-note').value || null
        }
      });
      renderIssue(issue.id, 'action');
    });

    /* Arrow-key movement within the evidence tablist */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var tab = e.target.closest && e.target.closest('[data-evtab]');
      if (!tab) return;
      var all = $$('[data-evtab]');
      var i = all.indexOf(tab);
      var next = all[(i + (e.key === 'ArrowRight' ? 1 : all.length - 1)) % all.length];
      if (!next) return;
      e.preventDefault();
      EV_TAB = next.dataset.evtab;
      renderIW02(currentIssue());
      var moved = $('[data-evtab="' + EV_TAB + '"]');
      if (moved) moved.focus();
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
    /* Everything after boot may animate. */
    if (document.readyState === 'complete') hasBooted = true;
    else window.addEventListener('load', function () { hasBooted = true; }, { once: true });
  }).catch(function (e) {
    console.error(e);
    fail('Could not load the demonstration data (' + e.message + ').');
  });

})();
