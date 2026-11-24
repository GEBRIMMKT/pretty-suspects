/* =====================================================================
   PRETTY SUSPECTS — motor do site
   Lê o conteúdo de data.js (window.PS) e monta os 18 capítulos,
   o modo apresentação, a votação e a revelação protegida.
   Para mudar textos e imagens, edite data.js (não precisa mexer aqui).
   ===================================================================== */
(function () {
  'use strict';
  const D = window.PS;
  const root = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const cap = s => String(s).charAt(0) + String(s).slice(1).toLowerCase();
  const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- armazenamento local (só neste computador) ---------------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('ps.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('ps.' + k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } }
  };
  const freshVote = () => ({ suspect: null, reason: '', tally: { agatha: 0, tina: 0, laila: 0 }, locked: false, lockedAt: null });
  const S = {
    vote: Object.assign(freshVote(), store.get('vote', {})),
    revealed: !!store.get('revealed', false),
    notes: store.get('notes', true) !== false,
    sound: false,
    mode: 'explore', chap: 0, step: 0,
    card: 0, confirm: null, ignoreFs: false
  };
  S.vote.tally = Object.assign({ agatha: 0, tina: 0, laila: 0 }, S.vote.tally || {});
  if (S.revealed && !S.vote.locked) S.revealed = false;

  /* A revelação vem de segredo.js (texto codificado), lida só quando a revelação é aberta. */
  let TRUTH = null;
  function truth() {
    if (TRUTH) return TRUTH;
    if (D.truth) return (TRUTH = D.truth);
    try {
      const b = atob(String(window.PS_SECRET || '').split('').reverse().join(''));
      const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
      TRUTH = JSON.parse(new TextDecoder().decode(u));
    } catch (e) { TRUTH = null; }
    return TRUTH;
  }

  const SUSPECTS = D.girls.filter(g => !g.victim);
  const KIND = { mockup: 'Mockup digital', arte: 'Arte digital plana', prototipo: 'Protótipo', final: 'Produto final · foto' };
  const girl = id => D.girls.find(g => g.id === id);

  /* ---------------- peças reutilizáveis ---------------- */
  const pending = (text) => `<p class="pending"><b>A PREENCHER · </b>${esc(text)}</p>`;
  const tbd = '<span class="tbd">a definir</span>';

  function slot(o) {
    return `<div class="slot" style="--ratio:${esc(o.ratio || '4 / 5')}">
      <div class="slot__top"><span class="slot__label">${esc(o.label || 'Imagem')}</span>${o.kind ? `<span class="slot__kind">${esc(KIND[o.kind] || o.kind)}</span>` : ''}</div>
      <div><span class="slot__soon">imagem em breve</span><span class="slot__file notes-only">${esc(o.hint || 'Inserir em data.js')}</span></div>
    </div>`;
  }
  function media(src, o = {}) {
    if (!src) return slot(o);
    const z = o.zoom === false ? '' : ` data-zoom="${esc(src)}" data-cap="${esc(o.cap || o.label || '')}"`;
    return `<div class="media ${o.contain ? 'media--contain' : ''} ${o.zoom === false ? '' : 'zoomable'}" style="--ratio:${esc(o.ratio || 'auto')}"><img src="${esc(src)}" alt="${esc(o.alt || o.label || '')}" loading="lazy" decoding="async"${z}></div>`;
  }
  const chapTag = c => `<div class="chap-tag"><span class="num">${c.n}</span><span class="bar"></span><span class="label">Chapter ${c.n} — ${esc(c.t)}</span></div>`;
  const wordmark = (cls = '') => D.brand.logo
    ? `<img class="${cls}" src="${esc(D.brand.logo)}" alt="Pretty Suspects">`
    : `<div class="wordmark ${cls}" role="img" aria-label="Pretty Suspects"><span class="w1">PRETTY</span><span class="w2">SUSPECTS</span></div>`;
  const seal = (s = '', txt = '♥') => `<span class="seal" style="${s ? '--s:' + s : ''}" aria-hidden="true"><span>${txt}</span></span>`;
  const rot = (i, amp = 3) => (((i * 37) % 7) - 3) * (amp / 3);

  /* ======================================================================
     CAPÍTULOS
     ====================================================================== */
  const CH = [
    { id: 'home', n: '01', t: 'THE OPENING', menu: 'HOME', g: 'ink', cls: 'hero', r: rHome },
    { id: 'concept', n: '02', t: 'THE CONCEPT', menu: 'CONCEPT', g: 'paper', cls: 'lace-top', r: rConcept },
    { id: 'moodboard', n: '03', t: 'THE MOODBOARD', g: 'ink', r: rMood },
    { id: 'identity', n: '04', t: 'THE VISUAL IDENTITY', menu: 'IDENTITY', g: 'paper', cls: 'lace-top', r: rIdentity },
    { id: 'story', n: '05', t: 'THE LAST PARTY', menu: 'THE STORY', g: 'ink', cls: 'story', r: rStory },
    { id: 'girls', n: '06', t: 'MEET THE GIRLS', menu: 'THE GIRLS', g: 'pink', cls: 'lace-top', r: rGirls },
    { id: 'cards', n: '07', t: 'THE CARD SYSTEM', menu: 'THE CARDS', g: 'ink', r: rCards },
    { id: 'evidence', n: '08', t: 'THE EVIDENCE', g: 'pink', cls: 'lace-top', r: rEvidence },
    { id: 'timeline', n: '09', t: 'THE TIMELINE', g: 'paper', r: rTimeline },
    { id: 'product', n: '10', t: 'THE PRODUCT', menu: 'THE PRODUCT', g: 'ink', r: rProduct },
    { id: 'packaging', n: '11', t: 'THE PACKAGING', g: 'pink', cls: 'lace-top', r: rPackaging },
    { id: 'process', n: '12', t: 'BEHIND THE SCENES', menu: 'PROCESS', g: 'paper', cls: 'diary', r: rProcess },
    { id: 'materials', n: '13', t: 'THE MATERIALIZATION', g: 'ink', r: rMaterials },
    { id: 'play', n: '14', t: 'HOW TO PLAY', menu: 'HOW TO PLAY', g: 'pink', cls: 'lace-top', r: rPlay },
    { id: 'vote', n: '15', t: 'WHO DID IT?', g: 'ink', cls: 'vote', r: rVote },
    { id: 'reveal', n: '16', t: 'THE FINAL REVEAL', g: 'black', cls: 'reveal', r: rReveal, locked: () => !S.revealed },
    { id: 'credits', n: '17', t: 'THE CREATIVE TEAM', menu: 'CREDITS', g: 'ink', r: rCredits },
    { id: 'end', n: '18', t: 'THE END', g: 'black', cls: 'end', r: rEnd }
  ];
  const idx = id => CH.findIndex(c => c.id === id);
  const available = i => !(CH[i].locked && CH[i].locked());

  /* ---------- 01 abertura ---------- */
  function rHome(c) {
    const b = D.brand;
    const items = ['CLASSIFIED FILE', b.caseNo, b.date, 'DO NOT TRUST ANYONE', 'CONFIDENTIAL', b.slogan2];
    const tick = items.map((t, i) => i % 2 ? `<i>${esc(t)}</i>` : `<span>${esc(t)}</span>`).join('');
    const photos = D.girls.map((g, i) => `
      <figure class="polaroid hero__p hero__p--${i + 1}">
        <div class="polaroid__img"><img src="${esc(g.img)}" alt="${esc(cap(g.name))}" decoding="async"><span class="datestamp">${esc(b.dateStamp)}</span></div>
        <figcaption class="polaroid__cap">${esc(cap(g.name))}<small>N° 00${i + 1}</small></figcaption>
      </figure>`).join('');
    const band = Array(8).fill('CONFIDENTIAL · DO NOT TRUST ANYONE · CASE NO. 001 · ').join('');
    return `
      <div class="ticker" aria-hidden="true"><div class="ticker__track">${tick}${tick}</div></div>
      <div class="hero__stage wrap">
        <div class="hero__photos">${photos}</div>
        <div class="hero__center" style="position:relative;z-index:3;text-align:center">
          <h1 class="hero__title"><span class="l1">PRETTY</span><span class="l2">SUSPECTS</span>
            <svg class="hero__swoosh" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true"><path d="M30 120 C 260 215, 640 200, 975 70" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>
          </h1>
          <p class="hero__case"><span class="chrome">${esc(b.caseId)}</span> — ${esc(b.edition)}</p>
        </div>
      </div>
      <div class="tape-band" aria-hidden="true"><span>${band}</span></div>
      <span class="stamp hero__stamp thunk" aria-hidden="true">Confidential</span>
      <div class="hero__foot wrap">
        <div>
          <p class="cond hero__slogan"><span>${esc(b.slogan[0])}</span><em>${esc(b.slogan[1])}</em><span>${esc(b.slogan[2])}</span></p>
          <div class="hero__meta label"><span>${esc(b.caseNo)}</span><span>${esc(b.date)}</span><span>Classified file</span></div>
        </div>
        <div class="hero__ctas">
          <button class="btn btn--ghost" type="button" data-action="goto" data-target="concept">Explore the project</button>
          <button class="btn btn--solid" type="button" data-action="present-start"><span class="dot" aria-hidden="true"></span>Presentation mode</button>
        </div>
      </div>`;
  }

  /* ---------- 02 conceito ---------- */
  function rConcept(c) {
    const k = D.concept;
    return `<div class="wrap">
      ${chapTag(c)}
      <div class="concept__grid" data-step="0">
        <h2 class="disp concept__title"><span>${esc(k.title[0])}</span><span class="b">${esc(k.title[1])}</span></h2>
        <div>
          <div class="concept__text body-col">${k.text.map(p => `<p>${esc(p)}</p>`).join('')}</div>
          <div class="concept__meta label"><span>Edição 001</span><span>The Last Party</span><span>Y2K · Teen thriller · Editorial · Mystery · Product design</span></div>
        </div>
      </div>
      <div class="pillars" data-step="1">${k.pillars.map((p, i) => `
        <div class="pillar"><span class="n">${pad(i + 1)}</span><h3>${esc(p.k)}</h3><p>${esc(p.t)}</p></div>`).join('')}
      </div>
      <p class="pending" data-scroll-only style="margin-top:16px"><b>REVISAR · </b>os sete itens acima foram montados a partir do briefing. Ajuste em data.js → concept.pillars.</p>
      <div class="question" data-step="2"><span class="label">A provocação do jogo</span><p>${esc(k.question)}</p></div>
    </div>`;
  }

  /* ---------- 03 moodboard ---------- */
  function rMood(c) {
    const m = D.moodboard;
    const refs = m.refs.map((r, i) => `
      <figure class="ref" data-cats="${esc(r.cats.join('|'))}" style="--r:${rot(i, 2.4)}deg">
        ${i % 3 === 0 ? '<span class="tape tape--top"></span>' : ''}
        <button type="button" data-zoom="${esc(r.img)}" data-cap="${esc(r.label + ' — ' + r.cats.join(' · ') + (r.note ? ' — ' + r.note : ''))}" aria-label="Ampliar referência: ${esc(r.label)}">
          <img src="${esc(r.img)}" alt="${esc(r.label)}" loading="lazy" decoding="async">
        </button>
        <figcaption>${esc(r.label)}</figcaption>
      </figure>`).join('');
    return `<div class="wrap">
      ${chapTag(c)}
      <div class="mood__head" data-step="0">
        <h2 class="mood__title"><small>THE WORLD OF</small><b class="disp">PRETTY <span>SUSPECTS</span></b></h2>
      </div>
      <div class="mood__grid" data-step="0">
        <figure class="mood__board"><span class="tape"></span><span class="tape"></span>
          <img class="zoomable" src="${esc(m.img)}" alt="${esc(m.caption)}" data-zoom="${esc(m.img)}" data-cap="${esc(m.caption)}" decoding="async">
        </figure>
        <div class="mood__side">
          <p class="lede">A atmosfera da primeira edição: cultura Y2K, teen thriller, editorial de moda, mistério e design de produto. Renda, lacres e polaroids dividem espaço com carimbos e crachás.</p>
          <ul class="checklist" aria-label="Palavras-chave do moodboard">${m.keywords.map(k => `<li>${esc(k)}</li>`).join('')}</ul>
          ${m.influence ? `<p class="body-col">${esc(m.influence)}</p>` : pending('Como as referências influenciaram as decisões do grupo (data.js → moodboard.influence).')}
          <p class="label muted">Toque no moodboard para ampliar</p>
        </div>
      </div>
      <div data-step="1">
        <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:end;justify-content:space-between;margin-top:clamp(56px,8vw,110px)">
          <div><p class="label" style="opacity:.6;margin-bottom:10px">${m.refs.length} referências visuais</p><h3 class="cond" style="font-size:var(--fs-l)">The references</h3></div>
          <div class="chips" role="group" aria-label="Filtrar referências por categoria">
            <button class="chip" type="button" data-action="filter" data-cat="" aria-pressed="true">Todas</button>
            ${m.categories.map(k => `<button class="chip" type="button" data-action="filter" data-cat="${esc(k)}" aria-pressed="false">${esc(k)}</button>`).join('')}
          </div>
        </div>
        <p class="label" style="margin-top:14px;opacity:.6;letter-spacing:.08em;text-transform:none;font-weight:400;max-width:90ch">${esc(m.refsCredit || '')}</p>
        <p class="pending" style="margin-top:10px"><b>REVISAR · </b>as categorias de cada referência são uma organização sugerida.</p>
        <div class="refs">${refs}</div>
      </div>
    </div>`;
  }

  /* ---------- 04 identidade ---------- */
  function rIdentity(c) {
    const I = D.identity;
    const head = (n, t, extra = '') => `<div class="id-block__head"><h3>${t}</h3>${extra}<span class="label">${pad(n)} / 06</span></div>`;
    const sw = I.palette.map(p => {
      const dark = ['#1E1919', '#BE3E66'].includes(p.hex.toUpperCase());
      const chrome = /chrome|silver/i.test(p.name);
      return `<button type="button" class="swatch ${chrome ? 'swatch--chrome' : ''}" data-action="copy" data-copy="${esc(p.hex)}" style="--c:${esc(p.hex)};--on:${dark ? 'var(--paper)' : 'var(--ink)'}" aria-label="Copiar ${esc(p.name)} ${esc(p.hex)}">
        <span class="nm">${esc(p.name)}</span>
        <span><span class="hx">${esc(p.hex.toUpperCase())}</span><br><span class="rl">${esc(p.role)}</span></span>
      </button>`;
    }).join('');
    const fonts = I.fonts.map(f => {
      const cond = /f-cond|f-sans/.test(f.css);
      const st = `font-family:${f.css};${f.italic && /display/.test(f.css) ? 'font-style:italic;' : ''}${cond ? 'font-stretch:62%;' : ''}`;
      const maxW = Math.max.apply(null, f.weights);
      return `<article class="font-card">
        <div class="font-card__top"><span class="label">${esc(f.role)}</span><span class="pill ${f.status === 'oficial' ? '' : 'pill--warn'}">${esc(f.status)}</span></div>
        <div class="aa" style="${st}font-weight:${maxW}">Aa</div>
        <h4 class="fname">${esc(f.name)}</h4>
        <p class="sample" data-sample style="${st}font-weight:${cond ? 800 : maxW};${cond ? 'text-transform:uppercase;' : ''}">Every girl has something to hide.</p>
        <p class="abc" style="${st}">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 &amp; ! ? @ # ★</p>
        <div class="weights">${f.weights.map(w => `<span style="${st}font-weight:${w}">${w}</span>`).join('')}</div>
        <dl><dt>Uso</dt><dd>${esc(f.use)}</dd><dt>Por quê</dt><dd>${esc(f.why)}</dd>
        ${f.justification ? `<dt>Grupo</dt><dd>${esc(f.justification)}</dd>` : ''}</dl>
        ${f.justification ? '' : pending('Justificativa do grupo para esta fonte.')}
      </article>`;
    }).join('');
    const hier = [
      ['<span class="disp" style="font-size:clamp(2.4rem,5vw,5rem)">The Last Party</span>', 'Título · serifa display itálica 900'],
      ['<span class="cond" style="font-size:clamp(2rem,3.6vw,3.6rem)">Four friends. One dead.</span>', 'Manchete · grotesca condensada 800 · caixa alta'],
      ['<span class="lede">Quatro amigas foram convidadas para uma festa exclusiva.</span>', 'Narrativa · serifa regular'],
      ['<span class="mono" style="font-size:1.15rem">CASE NO. 001 · STATUS: INVESTIGATION</span>', 'Documento · máquina de escrever'],
      ['<span class="hand" style="font-size:2.4rem;color:var(--rose)">ela mentiu?</span>', 'Anotação · manuscrita'],
      ['<span>Texto de apoio, regras e instruções do jogo.</span>', 'Apoio · grotesca regular']
    ].map(r => `<div class="hier__row"><div>${r[0]}</div><div class="spec">${r[1]}</div></div>`).join('');
    const gdemo = [
      `<span class="stamp" style="font-size:1.5rem">Confidential</span>`,
      `<div class="polaroid" style="width:58%;--r:-6deg;padding:5px 5px 22px"><div class="polaroid__img" style="aspect-ratio:1;background:radial-gradient(circle at 40% 35%,#6b4a55,#1b1416)"><span class="datestamp" style="font-size:.8rem">31 10 '05</span></div></div>`,
      `<div class="mini-id"><div><b>PRETTY<br>SUSPECTS</b>CASE 001<br>SUBJECT: 00X<br>STATUS: —</div><i></i></div>`,
      `<div class="lace-demo"></div>`,
      seal('86px'),
      `<div class="ticket"><b>ADMIT ONE</b><small>THE LAST PARTY · N° 0001</small></div>`,
      `<div style="position:relative;width:70%;aspect-ratio:4/3;background:var(--paper);transform:rotate(3deg);box-shadow:0 8px 16px -8px rgba(0,0,0,.4)"><span class="tape tape--top"></span><span class="hand" style="position:absolute;left:12px;bottom:10px;font-size:1.4rem;color:var(--ink)">trust no one</span></div>`,
      `<span class="star" style="--s:84px"></span>`
    ];
    const gcls = ['', 'gfx--ink', '', 'gfx--pink', 'gfx--ink', '', 'gfx--pink', 'gfx--ink'];
    const graphics = I.graphics.map((g, i) => `<div class="gfx ${gcls[i] || ''}"><div class="gfx__demo">${gdemo[i] || ''}</div><div><h4>${esc(g.k)}</h4><p>${esc(g.t)}</p></div></div>`).join('');

    return `<div class="wrap">
      ${chapTag(c)}
      <div class="id__intro" data-step="0">
        <h2 class="disp id__title">LOOKS CAN BE <span>DECEIVING.</span></h2>
        <p class="lede body-col">Um sistema feito de contrastes: o glamour de uma revista adolescente e a frieza de um arquivo confidencial na mesma página. A tipografia separa o que é aparência do que é segredo.</p>
      </div>
      <p class="pending" style="margin-top:22px"><b>PROVISÓRIO · </b>o logo, as fontes e a hierarquia desta seção recriam o moodboard para o site. Substitua pelas escolhas oficiais do grupo em data.js → identity e brand.logo.</p>

      <div class="id-block" data-step="1">
        ${head(1, 'Logotipo', '<span class="provisional">Recriação provisória</span>')}
        <div class="logo-stage">
          <div class="logo-hero">${wordmark()}</div>
          <div class="logo-side">
            <figure class="logo-ref"><img class="zoomable" src="${esc(D.brand.logoMoodboard)}" alt="Logotipo como aparece no moodboard" data-zoom="${esc(D.brand.logoMoodboard)}" data-cap="Logotipo no moodboard do grupo" loading="lazy"><figcaption>Logotipo no moodboard do grupo</figcaption></figure>
            <div class="logo-grounds"><div class="g-paper">${wordmark()}</div><div class="g-pink">${wordmark()}</div><div class="g-ink">${wordmark()}</div></div>
          </div>
        </div>
        <div class="signature">
          <div class="sig sig--hand"><span class="label">Assinatura da edição</span><span class="hand rose">The Last Party</span></div>
          <div class="sig sig--case"><span class="label">Identificação do caso</span><span class="mono">CASE 001:<br>THE LAST PARTY<br>STATUS: INVESTIGATION</span></div>
          <div class="sig sig--ticket"><span class="label">Ingresso</span><span class="cond">ADMIT ONE<br>THE LAST PARTY</span><span class="mono" style="font-size:.8rem">N° 0001</span></div>
        </div>
        ${D.brand.logo ? '' : pending('Arquivo oficial do logotipo e variações (data.js → brand.logo e brand.logoNegative).')}
      </div>

      <div class="id-block" data-step="2">
        ${head(2, 'Paleta cromática', '<span class="provisional">HEX amostrado do moodboard</span>')}
        <div class="swatches">${sw}</div>
        <div class="accent-strip"><span class="cond" style="font-size:1.6rem">${esc(I.accent.name)}</span><span class="mono">${esc(I.accent.hex)}</span><span style="font-size:.9rem">${esc(I.accent.role)}</span></div>
        ${I.paletteNote ? `<p class="body-col" style="margin-top:18px">${esc(I.paletteNote)}</p>` : pending('Justificativa da paleta e confirmação dos códigos HEX do arquivo original.')}
        <p class="label muted" style="margin-top:14px" data-scroll-only>Toque numa cor para copiar o HEX</p>
      </div>

      <div class="id-block" data-step="3">
        ${head(3, 'Tipografia', '<span class="provisional">Fontes provisórias</span>')}
        <div class="tester" data-scroll-only><label for="type-tester">Teste as fontes</label><input id="type-tester" type="text" value="Every girl has something to hide." maxlength="80" autocomplete="off"></div>
        <div class="fonts">${fonts}</div>
        ${I.typeNote ? `<p class="body-col" style="margin-top:18px">${esc(I.typeNote)}</p>` : pending('Justificativa geral das escolhas tipográficas do grupo (data.js → identity.typeNote).')}
      </div>

      <div class="id-block" data-step="4">
        ${head(4, 'Hierarquia da informação')}
        <div class="hier">${hier}</div>
      </div>

      <div class="id-block" data-step="5">
        ${head(5, 'Grafismos e elementos de apoio')}
        <div class="graphics">${graphics}</div>
      </div>

      <div class="id-block" data-step="6">
        ${head(6, 'Critérios de composição', '<span class="provisional">Leitura do moodboard</span>')}
        <ol class="crit">${I.composition.map(t => `<li>${esc(t)}</li>`).join('')}</ol>
        ${I.compositionNote ? `<p class="body-col" style="margin-top:18px">${esc(I.compositionNote)}</p>` : pending('Critérios de composição definidos pelo grupo.')}
        <div class="apps">
          <button type="button" data-action="goto" data-target="cards"><small>Aplicação</small>As cinco cartas</button>
          <button type="button" data-action="goto" data-target="packaging"><small>Aplicação</small>A embalagem</button>
          <button type="button" data-action="goto" data-target="product"><small>Aplicação</small>Os mockups</button>
        </div>
      </div>
    </div>`;
  }

  /* ---------- 05 the last party ---------- */
  function phone(id) {
    return `<div class="phone has-new" data-phone id="${id}">
      <div class="phone__top"><div class="phone__speaker"></div>
        <div class="phone__screen" aria-live="polite">
          <div class="phone__bar"><span>▮▮▮▯</span><span>31/10/05</span><span>▭</span></div>
          <div class="phone__new"><span class="env" aria-hidden="true"></span><span>1 NOVA MENSAGEM</span><span style="opacity:.7">[ OK ] para ler</span></div>
          <div class="phone__msg" hidden><span class="from">DE: NÚMERO DESCONHECIDO</span><span class="txt"></span></div>
        </div>
      </div>
      <div class="phone__hinge"></div>
      <div class="phone__bottom">
        <div class="phone__nav"><span class="phone__soft"></span><button type="button" data-action="read-msg" aria-label="Ler a mensagem anônima">OK</button><span class="phone__soft"></span></div>
        <div class="phone__keys" aria-hidden="true">${'1 2 3 4 5 6 7 8 9 * 0 #'.split(' ').map(k => `<span>${k}</span>`).join('')}</div>
      </div>
      <p class="phone__caption" style="margin-top:14px">Celular de Alice · 2005</p>
    </div>`;
  }
  function rStory(c) {
    const s = D.story;
    const n = s.beats.length;
    const beats = s.beats.map((b, i) => `
      <li class="beat" data-step="${i + 1}"${b.flicker ? ' data-flicker' : ''}${b.phone ? ' data-phone-beat' : ''}>
        <span class="n">${pad(i + 1)} / ${pad(n)}</span>
        <div>
          ${b.big ? `<span class="big">${esc(b.big)}</span>` : ''}
          <p>${esc(b.t)}${b.t2 ? `<span class="t2">${esc(b.t2)}</span>` : ''}</p>
          ${b.phone ? `<div style="margin-top:28px;display:grid;justify-items:center" data-pres-only>${phone('phone-pres')}</div>` : ''}
        </div>
      </li>`).join('');
    return `<div class="flicker-layer" aria-hidden="true"></div>
    <div class="wrap">
      ${chapTag(c)}
      <div data-step="0">
        <p class="label" style="opacity:.7;margin-bottom:14px">${esc(D.brand.caseNo)} — ${esc(s.caseName.toUpperCase())}</p>
        <h2 class="story__date">OCT 31 <span>2005</span></h2>
        <dl class="casefile">
          <div><dt>Local</dt><dd>${esc(s.place)}</dd></div>
          <div><dt>Evento</dt><dd>${esc(s.event)}</dd></div>
          <div><dt>Data</dt><dd>${esc(s.date)}</dd></div>
          <div><dt>Horário do crime</dt><dd>${esc(s.crimeWindow)}</dd></div>
        </dl>
      </div>
      <div class="story__body">
        <ol class="beats">${beats}</ol>
        <aside class="story__phone" data-scroll-only>${phone('phone-scroll')}</aside>
      </div>
      <div class="story__end" data-step="${n + 1}"><p class="cond"><span>${esc(s.ending[0])}</span><span>${esc(s.ending[1])}</span></p></div>
    </div>`;
  }

  /* ---------- 06 personagens ---------- */
  function rGirls(c) {
    let sn = 0;
    const tags = D.girls.map(g => g.victim ? 'VICTIM' : 'SUSPECT ' + pad(++sn));
    const lineup = D.girls.map((g, i) => `
      <button type="button" class="lineup__item ${g.victim ? 'victim' : ''}" data-action="girl" data-i="${i}">
        <div class="lineup__photo"><img src="${esc(g.img)}" alt="${esc(cap(g.name))}" loading="lazy" decoding="async"><span class="tag">${tags[i]}</span><span class="datestamp">${esc(D.brand.dateStamp)}</span></div>
        <span class="lineup__name">${esc(g.name)}</span><span class="lineup__role">${esc(g.title)}</span>
      </button>`).join('');
    const dossiers = D.girls.map((g, i) => `
      <article class="dossier ${g.victim ? 'dossier--victim' : ''}" id="dossier-${esc(g.id)}" data-step="${i + 1}">
        <figure class="dossier__photo"><span class="clip" aria-hidden="true"></span>
          <div class="ph"><img class="zoomable" src="${esc(g.img)}" alt="${esc(cap(g.name))} — ${esc(g.title)}" data-zoom="${esc(g.img)}" data-cap="${esc(g.name + ' — ' + g.title)}" loading="lazy" decoding="async"></div>
          <span class="sign">${esc(cap(g.name))}</span>
        </figure>
        <div>
          <div class="dossier__meta"><span>Pretty Suspects · Case 001</span><span>${tags[i]}</span></div>
          <h3 class="dossier__name">${esc(g.name)}</h3>
          <p class="dossier__role">${esc(g.title)}</p>
          <span class="stamp dossier__status thunk ${g.victim ? 'stamp--paper' : ''}">Status: ${esc(g.status)}</span>
        </div>
        <dl class="dossier__fields">${g.fields.map(f => `<div><dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>`).join('')}</dl>
        <p class="dossier__quote">“${esc(g.quote)}”</p>
      </article>`).join('');
    return `<div class="wrap">
      ${chapTag(c)}
      <div data-step="0">
        <div class="girls__head"><h2 class="disp girls__title">MEET THE <span>GIRLS</span></h2><p class="hand" style="font-size:clamp(1.7rem,2.8vw,2.8rem)">Every girl has something to hide.</p></div>
        <div class="lineup">${lineup}</div>
      </div>
      <div class="dossiers">${dossiers}</div>
    </div>`;
  }

  /* ---------- 07 cartas ---------- */
  const isLocked = c => c.sealed && !S.revealed;
  function envelope() {
    return `<div class="envelope">${seal()}<div class="env-label"><span class="stamp">Confidential</span><small>DO NOT OPEN BEFORE THE VOTE</small></div></div>`;
  }
  function cardFace(c, side) {
    const src = side === 'front' ? c.front : (c.back || D.cardSpec.sharedBack);
    if (src) return `<div class="cface"><img src="${esc(src)}" alt="Carta ${esc(c.n)} — ${esc(c.name)} (${side === 'front' ? 'frente' : 'verso'})" loading="lazy" decoding="async"></div>`;
    if (side === 'front') return `<div class="cface cface--ph"><span class="cn">${esc(c.n)}</span><span class="ct">${esc(c.name)}<br><span style="font-size:.62em;opacity:.7">${esc(c.sub)}</span></span><span class="cs">Frente · arte do grupo a inserir</span></div>`;
    return `<div class="cface cface--ph cface--back"><span class="cn">${esc(c.n)}</span><span class="ct">Verso</span><span class="cs">Arte do grupo a inserir</span></div>`;
  }
  function cinfo(c) {
    const sp = D.cardSpec;
    const row = (k, v, always) => v ? `<dt>${k}</dt><dd>${v}</dd>` : (always ? '' : `<dt data-scroll-only>${k}</dt><dd data-scroll-only>${tbd}</dd>`);
    return `<div class="cinfo__n">${esc(c.n)}</div>
      <h3 class="cinfo__name">${esc(c.name)}</h3>
      <p class="cinfo__sub">${esc(c.sub)}</p>
      <dl>
        ${row('Categoria', esc(c.category))}
        ${row('Função no jogo', esc(c.fn))}
        ${row('Conteúdo', '<ul>' + c.content.map(x => `<li>${esc(x)}</li>`).join('') + '</ul>')}
        ${c.visual ? row('Proposta visual', esc(c.visual)) : ''}
        ${row('Tipografia', esc(c.typeNotes))}
        ${row('Dimensões', esc(sp.size))}
        ${row('Material', esc(sp.paper))}
      </dl>
      ${isLocked(c) ? `<p class="sealed-note">${seal('38px')}<span>Lacrada no envelope até a votação final. Só o verso pode ser visto.</span></p>` : ''}`;
  }
  function rCards(c) {
    const fan = D.cards.map((k, i) => `
      <button type="button" class="fan__card" style="--r:${(i - 2) * 8}deg" data-action="card" data-i="${i}" aria-label="Carta ${esc(k.n)} — ${esc(k.name)}">
        ${isLocked(k) ? envelope() : cardFace(k, k.front ? 'front' : 'front')}
        <span class="lbl">${esc(k.n)} · ${esc(k.name)}</span>
      </button>`).join('');
    const tabs = D.cards.map((k, i) => `<button type="button" role="tab" data-action="card" data-i="${i}" aria-selected="${i === S.card}">${esc(k.n)} ${esc(k.name)}</button>`).join('');
    return `<div class="wrap">
      ${chapTag(c)}
      <div data-step="0">
        <h2 class="cond cards__title">FIVE CARDS. <span>ONE DEADLY SECRET.</span></h2>
        <p class="lede body-col" style="margin-top:22px">Cada carta tem uma função no jogo e uma identidade própria. Juntas, formam um sistema: a quinta só sai do envelope no fim.</p>
        <div class="fan">${fan}</div>
        ${pending('Artes de frente e verso das cinco cartas (data.js → cards[].front / back). Proporção atual dos espaços: ' + D.cardSpec.ratio + '.')}
      </div>
      <div class="viewer" data-step-from="1" id="viewer">
        <div class="viewer__tabs" role="tablist" aria-label="Escolha uma carta">${tabs}</div>
        <div>
          <div class="flip" id="flip"></div>
          <p class="flip__side" id="flip-side"></p>
          <div class="flip__ctrl">
            <button class="btn btn--ghost" type="button" data-action="flip">Virar carta</button>
            <button class="btn btn--ghost" type="button" data-action="card-zoom">Ampliar</button>
          </div>
        </div>
        <div class="cinfo" id="cinfo"></div>
      </div>
    </div>`;
  }
  function renderViewer() {
    const flip = $('#flip'); if (!flip) return;
    const c = D.cards[S.card];
    flip.classList.remove('is-flipped');
    flip.innerHTML = `<div class="flip__inner"><div class="flip__face">${isLocked(c) ? envelope() : cardFace(c, 'front')}</div><div class="flip__face flip__face--back">${cardFace(c, 'back')}</div></div>`;
    $('#flip-side').textContent = isLocked(c) ? 'ENVELOPE LACRADO · toque em virar para ver o verso' : 'FRENTE';
    $('#cinfo').innerHTML = cinfo(c);
    $$('#viewer [role="tab"]').forEach((t, i) => t.setAttribute('aria-selected', String(i === S.card)));
  }

  /* ---------- 08 evidências ---------- */
  const keySVG = `<svg viewBox="0 0 220 90" aria-hidden="true"><defs><linearGradient id="kg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#c5bcb2"/><stop offset=".55" stop-color="#857d77"/><stop offset="1" stop-color="#e8e3de"/></linearGradient></defs>
    <circle cx="44" cy="45" r="30" fill="none" stroke="url(#kg)" stroke-width="12"/><circle cx="44" cy="45" r="9" fill="url(#kg)"/>
    <path d="M74 40 H200 V50 H74 Z" fill="url(#kg)"/><path d="M160 50 v18 h10 v-10 h8 v14 h10 V50 Z" fill="url(#kg)"/></svg>`;
  function evVisual(e) {
    switch (e.kind) {
      case 'photo': return `<div class="evphoto"><div class="evphoto__img">${e.img ? `<img src="${esc(e.img)}" alt="${esc(e.label)}">` : '<div class="evphoto__mirror"><span class="star" style="--s:20px"></span></div>'}</div><span class="datestamp">${esc(D.brand.dateStamp)}</span></div>`;
      case 'key': return `<div class="evkey"><span class="ttag">ROOM KEY</span>${e.img ? `<img src="${esc(e.img)}" alt="${esc(e.label)}">` : keySVG}</div>`;
      case 'message': return `<div class="evmsg"><div class="from"><span>ENVIADA</span><span>${esc(e.time || '')}</span></div><p style="margin-top:6px">“${esc(e.quote)}”</p></div>`;
      case 'alibi': return `<div class="evphoto"><div class="evphoto__img">${e.img ? `<img src="${esc(e.img)}" alt="${esc(e.label)}">` : '<div class="evphoto__hall"><i></i></div>'}</div><span class="datestamp">${esc(e.time || '')}</span></div>`;
      default: return `<div class="evnote">${esc(e.quote || '')}</div>`;
    }
  }
  function evDetail(e) {
    return `<div class="ev-detail__vis">${evVisual(e)}</div>
      <div>
        <div class="ev-detail__n">EV. ${esc(e.n)}</div>
        <h3>${esc(e.title)}</h3>
        <p>${esc(e.text)}</p>
        ${e.quote && e.kind !== 'note' ? `<blockquote>“${esc(e.quote)}”</blockquote>` : (e.kind === 'note' ? `<blockquote>“${esc(e.quote)}”</blockquote>` : '')}
        <p class="label" style="margin-top:26px;opacity:.6">Perguntas para a turma</p>
        <ul class="ask">${e.ask.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
      </div>`;
  }
  function rEvidence(c) {
    const alice = girl('alice');
    const items = D.evidence.map((e, i) => `
      <button type="button" class="evi e${i + 1}" data-action="ev" data-i="${i}" aria-label="Abrir evidência ${esc(e.n)}: ${esc(e.label)}">
        <span class="evi__tag">EV. ${esc(e.n)}</span><span class="evi__pin" aria-hidden="true"></span>
        ${evVisual(e)}
        <span class="evi__cap">${esc(e.label)}</span>
      </button>`).join('');
    return `<div class="wrap">
      ${chapTag(c)}
      <div data-step="0">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:20px">
          <h2 class="disp ev__title">THE DEVIL IS IN THE <span>DETAILS.</span></h2>
          <span class="stamp stamp--ink thunk" style="font-size:clamp(1.1rem,1.8vw,1.8rem)">Evidence · Case 001</span>
        </div>
        <p class="lede body-col" style="margin-top:18px">Cinco pistas. Nenhuma prova sozinha. Abra cada evidência e cruze com os álibis.</p>
        <div class="board" id="board">
          <svg class="threads" aria-hidden="true"></svg>
          <div class="board__center"><figure class="polaroid"><div class="polaroid__img"><img src="${esc(alice.img)}" alt="Alice" loading="lazy"></div><figcaption class="polaroid__cap">Alice<small>VICTIM</small></figcaption></figure></div>
          ${items}
        </div>
        <p class="ev-legend"><span>Complementa a carta 04 — The Evidence.</span><span data-scroll-only>Toque numa evidência para abrir.</span></p>
      </div>
      ${D.evidence.map((e, i) => `<div class="ev-detail" data-pres-only data-step="${i + 1}">${evDetail(e)}</div>`).join('')}
    </div>`;
  }
  function drawThreads() {
    const b = $('#board'); if (!b || !b.offsetWidth) return;
    const svg = $('svg.threads', b);
    if (getComputedStyle(svg).display === 'none') return;
    const br = b.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${Math.round(br.width)} ${Math.round(br.height)}`);
    const c = $('.board__center', b).getBoundingClientRect();
    const cx = c.left + c.width / 2 - br.left, cy = c.top + c.height / 2 - br.top;
    svg.innerHTML = $$('.evi__pin', b).map(p => {
      const r = p.getBoundingClientRect();
      return `<line x1="${cx.toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(r.left + r.width / 2 - br.left).toFixed(1)}" y2="${(r.top + r.height / 2 - br.top).toFixed(1)}"/>`;
    }).join('');
  }

  /* ---------- 09 linha do tempo ---------- */
  function rTimeline(c) {
    const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const A = toMin('22:10'), B = toMin('23:05'), span = B - A;
    const x = t => ((toMin(t) - A) / span * 100).toFixed(2) + '%';
    const TY = { fato: 'Fato documentado', declaracao: 'Declaração', estimativa: 'Estimativa' };
    let ticks = '';
    for (let m = A; m <= B; m += 5) { const t = `${Math.floor(m / 60)}:${pad(m % 60)}`; ticks += `<span class="axis__tick" style="left:${x(t)}"><span>${t}</span></span>`; }
    const evs = D.timeline.map(e => `<span class="axis__ev ${e.time === '22:46' ? 'low' : ''}" style="left:${x(e.time)}"><i class="mk mk--${e.type}"></i><small>${esc(e.time)}</small></span>`).join('');
    const tracks = D.alibis.map((a, i) => `
      <div class="alibi-track" style="top:${112 + i * 42}px">
        <span class="who">${esc(a.who)} · DISSE</span>
        <span class="alibi-bar" style="left:${x(a.from)};width:calc(${x(a.to)} - ${x(a.from)})">${esc(a.where)} — ${esc(a.note)}</span>
      </div>`).join('');
    const cards = D.timeline.map(e => `
      <article class="tl-card tl-card--${e.type}">
        <span class="time">${esc(e.time)}</span>
        <span class="ty"><i class="mk mk--${e.type}"></i>${TY[e.type]}</span>
        <p>${esc(e.t)}</p>
      </article>`).join('');
    return `<div class="wrap">
      ${chapTag(c)}
      <h2 class="disp tl__title">WHAT HAPPENED <span>THAT NIGHT?</span></h2>
      <div class="tl-legend" aria-label="Legenda"><span><i class="mk mk--fato"></i>Fato documentado</span><span><i class="mk mk--declaracao"></i>Declaração de suspeita</span><span><i class="mk mk--estimativa"></i>Estimativa</span></div>
      <div class="axis-wrap" role="img" aria-label="Linha do tempo em escala de 22h10 a 23h05, com o intervalo estimado do crime entre 22h30 e 23h e os álibis declarados">
        <div class="axis">
          <span class="axis__window" style="left:${x('22:30')};width:calc(${x('23:00')} - ${x('22:30')})"><b>INTERVALO ESTIMADO DO CRIME</b></span>
          <span class="axis__line"></span>${ticks}${evs}${tracks}
        </div>
      </div>
      <div class="tl-cards">${cards}</div>
      <p class="tl-note">Os álibis são declarações das suspeitas, não fatos comprovados. Esta linha do tempo é um recurso do site e não substitui as cartas.</p>
    </div>`;
  }

  /* ---------- 10 produto ---------- */
  function shot(s, w) {
    return `<figure class="shot ${s.spoiler ? 'is-spoiler' : ''}" style="--w:${w}">
      <div style="position:relative">${media(s.img, { ratio: s.ratio, label: s.label, kind: s.kind, cap: s.label + ' · ' + (KIND[s.kind] || ''), hint: 'data.js → product' })}
        ${s.spoiler ? '<div class="spoiler-veil"><span class="stamp stamp--paper" style="font-size:1.3rem">Spoiler · após a revelação</span></div>' : ''}</div>
      <figcaption><span>${esc(s.label)}</span><span class="kind kind--${esc(s.kind)}">${esc(KIND[s.kind] || s.kind)}</span></figcaption>
    </figure>`;
  }
  function rProduct(c) {
    const P = D.product;
    const wOf = r => { const [a, b] = r.split('/').map(Number); const k = a / b; return k > 1.4 ? '46vw' : k >= 1 ? '32vw' : '26vw'; };
    const pages = [];
    for (let i = 0; i < P.shots.length; i += 4) pages.push(P.shots.slice(i, i + 4));
    return `<div class="wrap">
      ${chapTag(c)}
      <div data-step="0">
        <h2 class="disp prod__title" style="font-size:var(--fs-xxl)"><span>A GAME YOU</span><span>CAN'T PUT DOWN.</span></h2>
        <div class="prod__legend"><span class="kind kind--mockup">Mockup digital</span><span class="kind kind--arte">Arte digital plana</span><span class="kind kind--prototipo">Protótipo</span><span class="kind kind--final">Produto final · foto</span><span class="muted">Cada imagem indica o que ela é.</span></div>
        <div class="prod__hero">${shot(P.hero, '100%').replace('class="shot', 'class="shot shot--hero')}</div>
      </div>
      <div data-scroll-only>
        <div class="hscroll" tabindex="0" aria-label="Galeria de mockups (role para o lado)">${P.shots.map(s => shot(s, wOf(s.ratio))).join('')}</div>
        <p class="prod__hint"><span>←</span>Role para o lado para ver todos<span>→</span></p>
        ${pending('Se algum mockup mostrar a frente da carta 05, marque spoiler: true em data.js. A imagem fica borrada até a revelação.')}
      </div>
      ${pages.map((pg, k) => `<div class="prod__pages" data-pres-only data-step="${k + 1}" style="--cols:${pg.length}">${pg.map(s => shot(s, '100%')).join('')}</div>`).join('')}
    </div>`;
  }

  /* ---------- 11 embalagem ---------- */
  function rPackaging(c) {
    const P = D.packaging;
    const fields = P.fields.map(f => f[1] ? `<div><dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>` : `<div data-scroll-only><dt>${esc(f[0])}</dt><dd>${tbd}</dd></div>`).join('');
    return `<div class="wrap">
      ${chapTag(c)}
      <h2 class="pack__title" data-step="0"><small>CLASSIFIED EDITION</small><b class="disp">CASE <span>001</span></b></h2>
      <div class="pack__grid" data-step="0">
        <div class="folder-demo">
          <div class="folder" id="folder">
            <div class="folder__base">
              ${['01', '02', '03', '04'].map(n => `<div class="folder__slot">carta<br>${n}</div>`).join('')}
              <div class="folder__slot folder__slot--env">${seal()}</div>
            </div>
            <div class="folder__cover"><div class="diag"><span>capa</span><div class="box">logo · case 001<br>the last party</div><i></i><span>etiqueta confidential</span></div></div>
            <div class="folder__tab">CASE 001</div>
          </div>
          <button class="btn btn--ink" type="button" data-action="folder" id="folder-btn">Abrir a pasta</button>
          <p class="folder-cap">Diagrama ilustrativo da abertura · não é a arte final</p>
        </div>
        <div>
          <p class="lede">${esc(P.concept)} Abrir a caixa é abrir um arquivo secreto: quatro cartas à vista e a quinta lacrada num envelope.</p>
          <p class="label" style="margin:26px 0 10px">Elementos previstos</p>
          <ul class="elements">${P.elements.map(e => `<li>${esc(e)}</li>`).join('')}</ul>
          <dl class="fieldlist">${fields}</dl>
        </div>
      </div>
      <div class="pack__imgs" data-step="1">${P.images.map(im => `<figure>${media(im.img, { ratio: im.ratio, label: 'Embalagem — ' + im.label, hint: 'data.js → packaging.images' })}<figcaption>${esc(im.label)}</figcaption></figure>`).join('')}</div>
    </div>`;
  }

  /* ---------- 12 bastidores ---------- */
  function rProcess(c) {
    const done = D.process.filter(p => p.status === 'registrado').length;
    const entries = D.process.map((p, i) => {
      const ok = p.status === 'registrado';
      const img = p.imgs && p.imgs[0];
      return `<article class="entry ${ok ? '' : 'entry--pending'}" ${ok ? '' : 'data-scroll-only'}>
        <figure class="polaroid" style="--rr:${rot(i, 3)}deg">
          <div class="polaroid__img">${img ? `<img class="zoomable" src="${esc(img)}" alt="${esc(p.k)}" data-zoom="${esc(img)}" data-cap="${esc(p.k)}" loading="lazy">` : '<div class="ph-empty">foto da etapa</div>'}</div>
          <figcaption class="polaroid__cap">${pad(i + 1)}<small>${ok ? 'OK' : '—'}</small></figcaption>
        </figure>
        <h3>${esc(p.k)}</h3>
        ${p.note ? `<p>${esc(p.note)}</p>` : ''}
        <span class="st ${ok ? 'st--ok' : ''}">${ok ? 'Registrado' : 'A documentar'}</span>
      </article>`;
    }).join('');
    return `<div class="wrap">
      ${chapTag(c)}
      <div data-step="0">
        <h2 class="disp bts__title">BEHIND THE <span>PRETTY FACES.</span></h2>
        <p class="bts__count">${done} de ${D.process.length} etapas documentadas até agora.</p>
        <p class="lede body-col" style="margin-top:14px">O diário de produção: da pesquisa visual à materialização.</p>
        ${pending('Para cada etapa realizada: status "registrado", uma nota curta e fotos (data.js → process). Etapas sem registro não aparecem no modo apresentação.')}
      </div>
      <div class="entries" data-step="1">${entries}</div>
    </div>`;
  }

  /* ---------- 13 materialização ---------- */
  function scaleSVG() {
    const st = D.materials.standardMM, cm = D.materials.cardMM;
    const known = cm && cm.w > 0 && cm.h > 0;
    const gw = known ? cm.w : st.w * 1.6, gh = known ? cm.h : st.h * 1.6;
    const s = 170 / Math.max(st.h, gh);
    const x2 = 30 + Math.max(st.w * s + 50, 200);
    const W = Math.ceil(x2 + gw * s + 30);
    return `<svg viewBox="0 0 ${W} 230" role="img" aria-label="Comparação de escala entre a carta convencional e a carta do jogo">
      <rect x="30" y="${200 - st.h * s}" width="${st.w * s}" height="${st.h * s}" fill="none" stroke="#C5BCB2" stroke-width="1.5"/>
      <text x="30" y="218">Convencional ${st.w}×${st.h} mm</text>
      <rect x="${x2}" y="${200 - gh * s}" width="${gw * s}" height="${gh * s}" fill="rgba(220,82,130,.12)" stroke="#DC5282" stroke-width="2" ${known ? '' : 'stroke-dasharray="6 5"'}/>
      <text x="${x2}" y="218">${known ? `Jogo ${cm.w}×${cm.h} mm` : 'Pretty Suspects · a definir'}</text>
      ${known ? '' : `<text x="${x2 + gw * s / 2}" y="${200 - gh * s / 2}" text-anchor="middle" style="font-size:28px;fill:#DC5282">?</text>`}
    </svg>`;
  }
  function rMaterials(c) {
    const M = D.materials;
    const filled = M.specs.filter(s => s[1]).length;
    const rows = M.specs.map(s => s[1] ? `<div class="specsheet__row"><span>${esc(s[0])}</span><span>${esc(s[1])}</span></div>` : `<div class="specsheet__row" data-scroll-only><span>${esc(s[0])}</span><span>${tbd}</span></div>`).join('');
    const checks = D.checklist.map(k => `<li class="${k.done ? 'done' : ''}"><span class="box">${k.done ? '✕' : ''}</span><span>${esc(k.t)}</span><a href="#${esc(k.where)}">ver</a></li>`).join('');
    return `<div class="wrap">
      ${chapTag(c)}
      <div data-step="0">
        <h2 class="cond mat__title">FROM SCREEN <span>TO PAPER.</span></h2>
        <div class="mat__grid">
          <div class="specsheet">
            <div class="specsheet__head"><span>Ficha técnica · Case 001</span><span>${filled}/${M.specs.length} definidos</span></div>
            ${rows}
            ${filled ? '' : '<div class="specsheet__row" data-pres-only><span>Status</span><span>Especificações em definição pelo grupo.</span></div>'}
          </div>
          <div class="scale">${scaleSVG()}<p class="label" style="opacity:.7">O enunciado pede cartas maiores que o tamanho convencional, com pelo menos duas em escala ampliada.</p></div>
        </div>
        ${M.justification ? `<p class="body-col" style="margin-top:22px">${esc(M.justification)}</p>` : pending('Medidas (data.js → materials.cardMM), especificações e justificativas técnicas do grupo.')}
      </div>
      <div data-step="1">
        <div class="mat__photos">${M.photos.map(p => `<figure>${media(p.img, { ratio: p.ratio, label: p.label, hint: 'data.js → materials.photos' })}<figcaption class="label" style="margin-top:8px;opacity:.7">${esc(p.label)}</figcaption></figure>`).join('')}</div>
        <p class="label" style="margin-top:clamp(40px,6vw,70px);opacity:.7">Entregáveis da A2 — Projeto Baralho Tipográfico</p>
        <ul class="checks" style="margin-top:12px">${checks}</ul>
      </div>
    </div>`;
  }

  /* ---------- 14 como jogar ---------- */
  function rPlay(c) {
    const li = r => `<li><p>${esc(r.t)}${r.card ? `<span class="cardref">CARTA ${esc(r.card)}</span>` : ''}</p></li>`;
    return `<div class="wrap">
      ${chapTag(c)}
      <div data-step="0">
        <h2 class="disp play__title">ARE YOU READY TO FIND <span>THE KILLER?</span></h2>
        <p class="lede body-col" style="margin-top:20px">A turma vira uma equipe de investigação. O jogo acontece com as cartas impressas; o site só acompanha.</p>
      </div>
      <ol class="rules" data-scroll-only style="grid-template-rows:repeat(5,auto);grid-auto-flow:column">${D.rules.map(li).join('')}</ol>
      <ol class="rules" data-pres-only data-step="1">${D.rules.slice(0, 5).map(li).join('')}</ol>
      <ol class="rules rules--b" data-pres-only data-step="2">${D.rules.slice(5).map(li).join('')}</ol>
      <div class="roleplay" data-step="3">
        <ul>${D.roleplay.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
        <button class="cta-big" type="button" data-action="goto" data-target="vote">LET THE<br>INVESTIGATION<br>BEGIN.</button>
      </div>
    </div>`;
  }

  /* ---------- 15 votação ---------- */
  function rVote(c) {
    return `<div class="wrap">
      ${chapTag(c)}
      <div class="vote__head">
        <h2 class="disp vote__title">WHO KILLED <span>ALICE?</span></h2>
        <p class="cond vote__sub">THREE SUSPECTS. FIVE CLUES. ONE TRUTH.</p>
      </div>
      <div id="vote-ui"></div>
    </div>`;
  }
  function tallyTotal() { return SUSPECTS.reduce((a, g) => a + (S.vote.tally[g.id] || 0), 0); }
  function tallyRows() {
    const tot = tallyTotal();
    return SUSPECTS.map(g => {
      const v = S.vote.tally[g.id] || 0; const p = tot ? Math.round(v / tot * 100) : 0;
      return `<div class="tally__row"><b>${esc(cap(g.name))}</b>
        <div class="ctr"><button type="button" data-action="tally" data-id="${g.id}" data-d="-1" aria-label="Remover um voto de ${esc(cap(g.name))}">−</button><output aria-live="polite">${v}</output><button type="button" data-action="tally" data-id="${g.id}" data-d="1" aria-label="Adicionar um voto para ${esc(cap(g.name))}">+</button></div>
        <div class="tally__bar"><i style="width:${p}%"></i></div><span class="pct">${p}%</span></div>`;
    }).join('') + `<div class="tally__foot"><span>Total: <b>${tot}</b> ${tot === 1 ? 'voto' : 'votos'}</span><span style="display:flex;gap:16px"><button class="linkbtn" type="button" data-action="tally-pick">Usar a mais votada</button><button class="linkbtn" type="button" data-action="tally-reset">Zerar</button></span></div>`;
  }
  function renderVote() {
    const ui = $('#vote-ui'); if (!ui) return;
    const V = S.vote;
    if (!V.locked) {
      ui.innerHTML = `
        <div class="suspects" role="radiogroup" aria-label="Escolha uma suspeita">${SUSPECTS.map(g => `
          <button type="button" class="suspect" role="radio" aria-checked="${V.suspect === g.id}" data-action="pick" data-id="${g.id}">
            <div class="suspect__ph"><img src="${esc(g.img)}" alt="${esc(cap(g.name))}" loading="lazy" decoding="async"></div>
            <span class="suspect__name">${esc(g.name)}</span><span class="suspect__role">${esc(g.title)}</span>
            <span class="stamp accused">Accused</span>
          </button>`).join('')}
        </div>
        <div class="vote__panel">
          <div class="vote__box"><h3><label for="vote-reason">Por que você acredita que ela é a assassina?</label></h3>
            <textarea id="vote-reason" placeholder="Justificativa da turma (opcional)" maxlength="400">${esc(V.reason)}</textarea></div>
          <div class="vote__box"><h3>Contagem da turma · opcional</h3>
            <p style="font-size:.86rem;opacity:.75">Conte as mãos levantadas e registre aqui, neste computador. Nada é enviado pela internet.</p>
            <div class="tally" id="tally">${tallyRows()}</div></div>
        </div>
        <div class="vote__actions"><button class="btn btn--solid" type="button" data-action="lock" ${V.suspect ? '' : 'disabled'}>Lock the accusation</button></div>`;
    } else {
      const g = girl(V.suspect) || { name: '—', title: '' };
      const tot = tallyTotal();
      ui.innerHTML = `<div class="locked">
        <span class="stamp thunk go">Accusation locked</span>
        <p>A turma acusa <span class="disp" style="font-size:1.7em;color:var(--rose-lit)">${esc(g.name)}</span> · ${esc(g.title)}</p>
        ${V.reason ? `<p class="reason">“${esc(V.reason)}”</p>` : ''}
        ${tot ? `<p class="mono" style="font-size:.86rem;opacity:.8">${SUSPECTS.map(s => `${esc(cap(s.name))} ${S.vote.tally[s.id] || 0}`).join(' · ')} — ${tot} votos</p>` : ''}
        <p class="label muted">Registrada às ${esc(V.lockedAt || '')}</p>
        <div class="vote__actions">
          ${S.revealed
            ? '<button class="btn btn--solid" type="button" data-action="goto" data-target="reveal">Ver a revelação</button>'
            : '<button class="btn btn--solid" type="button" data-action="ask-reveal">Abrir a revelação</button><button class="btn btn--ghost" type="button" data-action="unlock-vote">Refazer acusação</button>'}
        </div>
      </div>`;
    }
  }

  /* ---------- 16 revelação (lacrada) ---------- */
  function rReveal(c) {
    if (!S.revealed) {
      return `<div class="wrap reveal--locked">
        ${chapTag(c).replace('THE FINAL REVEAL', 'CLASSIFIED')}
        ${seal()}
        <h2 class="cond">CLASSIFIED.</h2>
        <p>Este arquivo fica lacrado até a turma travar a acusação e a apresentadora confirmar a revelação.</p>
        <div style="margin-top:28px"><button class="btn btn--ghost" type="button" data-action="goto" data-target="vote">Ir para a votação</button></div>
      </div>`;
    }
    const T = truth();
    if (!T) return `<div class="wrap reveal--locked"><h2 class="cond">ARQUIVO NÃO ENCONTRADO.</h2><p>O arquivo segredo.js não foi carregado. Confira se ele está na mesma pasta do index.html.</p></div>`;
    const k = girl(T.killer);
    const right = S.vote.suspect === T.killer;
    const card5 = D.cards.find(x => x.sealed) || D.cards[4];
    return `<div class="stage-blood" aria-hidden="true"></div>
    <div class="wrap">
      <div class="rv" data-step="0"><p class="rv__line">${esc(T.lines[0])}</p></div>
      <div class="rv" data-step="1"><p class="rv__line rv__line--blood">${esc(T.lines[1])}</p></div>
      <div class="rv" data-step="2" data-flash>
        <div class="rv__name-wrap">
          <figure class="polaroid"><div class="polaroid__img"><img src="${esc(k.img)}" alt="${esc(cap(k.name))}"><span class="datestamp">${esc(D.brand.dateStamp)}</span></div><figcaption class="polaroid__cap">${esc(cap(k.name))}<small>${esc(k.title)}</small></figcaption></figure>
          <div><h2 class="rv__name">${esc(k.name)}.</h2><p class="rv__headline">${esc(T.headline)}</p><p class="rv__lede">${esc(T.lede)}</p></div>
        </div>
      </div>
      <div class="rv" data-step="3"><div class="rv__block"><h3><small>FILE 16 · 01</small>O MOTIVO</h3><ol class="rv__list">${T.motive.map(t => `<li>${esc(t)}</li>`).join('')}</ol></div></div>
      <div class="rv" data-step="4"><div class="rv__block"><h3><small>FILE 16 · 02</small>O QUE ACONTECEU</h3><ol class="rv__list">${T.happened.map(t => `<li>${esc(t)}</li>`).join('')}</ol></div></div>
      <div class="rv" data-step="5"><div class="rv__block"><h3><small>FILE 16 · 03</small>COMO AS PISTAS ENTREGAM ${esc(k.name)}</h3>
        <div><ol class="rv__list rv__list--ev">${T.clues.map(cl => `<li data-ev="${cl.ev === '—' ? '—' : 'EV.' + esc(cl.ev)}">${esc(cl.t)}</li>`).join('')}</ol>
        <div class="rv__others">${T.others.map(t => `<p>${esc(t)}</p>`).join('')}</div></div></div></div>
      <div class="rv" data-step="6"><div class="rv__truthcard">
        <div><div class="flip" id="flip-truth"><div class="flip__inner"><div class="flip__face">${envelope()}</div><div class="flip__face flip__face--back">${T.cardFront ? `<div class="cface"><img src="${T.cardFront}" alt="Carta 05 — The Truth (frente)"></div>` : cardFace(card5, 'front')}</div></div></div>
          <div class="flip__ctrl"><button class="btn btn--ghost" type="button" data-action="flip-truth">Abrir o envelope</button></div></div>
        <div><p class="label" style="opacity:.7">CARD ${esc(card5.n)}</p><h3 class="cinfo__name">${esc(card5.name)}</h3><p class="lede" style="margin-top:16px">Agora a frente pode ser vista: ${card5.content.map(esc).join(', ').toLowerCase()}.</p></div>
      </div></div>
      <div class="rv rv__result" data-step="7"><div>
        <p class="rv__line">${esc((right ? T.right : T.wrong)[0])}</p>
        <p class="rv__line">${esc((right ? T.right : T.wrong)[1])}</p>
        <p class="label" style="margin-top:28px;opacity:.7">Acusação da turma: ${esc((girl(S.vote.suspect) || { name: '—' }).name)}</p>
      </div></div>
      <div class="rv" data-step="8"><div><p class="rv__final"><span>${esc(T.final.split('. ')[0])}.</span><span>${esc(T.final.split('. ')[1] || '')}</span></p>
        <div class="end__btns" data-scroll-only><button class="btn btn--ghost" type="button" data-action="goto" data-target="credits">Créditos</button><button class="btn btn--ghost" type="button" data-action="present-reveal">Rever em modo apresentação</button></div></div></div>
    </div>`;
  }

  /* ---------- 17 créditos ---------- */
  function rCredits(c) {
    const T = D.team;
    const info = T.info.map(r => r[1] ? `<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>` : `<dt data-scroll-only>${esc(r[0])}</dt><dd data-scroll-only>${tbd}</dd>`).join('');
    return `<div class="wrap credits">
      <div data-step="0">
        <p class="credits__pre">A PRETTY SUSPECTS PRODUCTION · CHAPTER ${c.n}</p>
        <h2 class="disp credits__title">THE GIRLS BEHIND <span>THE CRIME.</span></h2>
        <div class="team">${T.members.map((m, i) => `
          <div class="member">
            <figure class="polaroid" style="--r:${rot(i, 3)}deg"><div class="polaroid__img"><img src="${esc(m.img)}" alt="${esc(cap(m.name))}" loading="lazy"></div><figcaption class="polaroid__cap">${esc(cap(m.name))}</figcaption></figure>
            <b>${esc(m.name)}</b>
            <span class="full">${m.full ? esc(m.full) : '<span class="pending" style="padding:.2em .5em">nome completo</span>'}</span>
            <span class="role">${esc(m.role)}</span>
          </div>`).join('')}
        </div>
        <p class="label" style="margin-top:30px;opacity:.7">${esc(T.shared)}</p>
        <p class="pending" style="margin:14px auto 0">${esc(T.rolesNote)}</p>
      </div>
      <div class="roll" data-step="1">
        <div class="roll__grp"><h3>Projeto acadêmico</h3><dl class="roll__info">${info}</dl></div>
        <div class="roll__grp"><h3>Referências</h3>${T.references ? `<p>${esc(T.references)}</p>` : ''}<p style="font-size:var(--fs-s);opacity:.8">${esc(D.moodboard.refsCredit || '')}</p>${T.references ? '' : pending('Fontes das referências visuais, das fontes tipográficas e dos materiais consultados.')}</div>
        <p class="disclaimer">${esc(T.disclaimer)}</p>
      </div>
      <div class="roll" data-step="2">
        <div class="roll__grp"><h3>Declaração de uso de inteligência artificial</h3>
          <div class="ai-box"><span class="pill pill--warn notes-only" style="justify-self:start">Rascunho · revisar</span><p>${esc(T.aiStatement)}</p></div></div>
      </div>
    </div>`;
  }

  /* ---------- 18 fim ---------- */
  function rEnd(c) {
    return `<div class="wrap">
      <p class="label" style="opacity:.6;margin-bottom:22px">${esc(D.brand.caseId)} — ${esc(D.brand.edition)}</p>
      <h2 class="end__closed"><span>THE CASE IS CLOSED.</span><span>THE SECRETS AREN'T.</span></h2>
      ${wordmark()}
      <div><div class="next-case"><span class="label">CASE 002</span><span class="stamp" style="font-size:1.6rem;color:var(--rose-lit)">Classified</span><span class="redact"></span><span class="redact"></span><span class="label" style="opacity:.6">Coming soon</span></div></div>
      <div class="end__btns">
        <button class="btn btn--ghost" type="button" data-action="goto" data-target="home">Voltar ao início</button>
        <button class="btn btn--ghost" type="button" data-action="explore">Explorar o projeto</button>
        <button class="btn btn--ghost" type="button" data-action="reset">Reiniciar a investigação</button>
        <button class="btn btn--solid" type="button" data-action="exit" data-pres-only>Encerrar apresentação</button>
      </div>
    </div>`;
  }

  /* ======================================================================
     MONTAGEM
     ====================================================================== */
  function sectionHTML(c) {
    return `<section id="${c.id}" class="scene scene--${c.g} ${c.cls || ''}" data-n="${c.n}" aria-label="${esc(c.n + ' — ' + c.t)}">${c.r(c)}</section>`;
  }
  function mount() {
    $('#chapters').innerHTML = CH.map(sectionHTML).join('');
    renderViewer(); renderVote(); buildNav();
  }
  function remount(id) {
    const c = CH[idx(id)]; const el = $('#' + id); if (!el) return;
    el.innerHTML = c.r(c);
    if (id === 'cards') renderViewer();
    if (id === 'vote') renderVote();
  }
  function buildNav() {
    $('#navlinks').innerHTML = CH.filter(c => c.menu).map(c => `<a href="#${c.id}" data-nav="${c.id}">${esc(c.menu)}</a>`).join('');
    $('#index-list').innerHTML = CH.map((c, i) => available(i)
      ? `<a href="#${c.id}" data-idx="${i}"><span>${c.n}</span><b>${esc(c.t)}</b></a>`
      : `<a class="locked" aria-disabled="true" data-locked="1"><span>${c.n}</span><b>CLASSIFIED</b></a>`).join('');
  }

  /* ======================================================================
     NAVEGAÇÃO NORMAL (scroll)
     ====================================================================== */
  function goto(id) {
    const i = idx(id); if (i < 0) return;
    closeAll();
    if (S.mode === 'present') { if (available(i)) goChap(i); return; }
    const el = $('#' + id); if (el) el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
  }
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement.scrollHeight - innerHeight;
      $('#progress').style.width = (h > 0 ? (scrollY / h * 100) : 0) + '%';
      ticking = false;
    });
  }
  function observe() {
    if (!('IntersectionObserver' in window)) { $$('.scene').forEach(s => s.classList.add('seen')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        $$('#navlinks a').forEach(a => a.classList.toggle('is-active', a.dataset.nav === id));
      }
    }), { rootMargin: '-45% 0px -50% 0px' });
    const seen = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('seen'); if (e.target.id === 'evidence') drawThreads(); } }), { threshold: .12 });
    const flick = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && S.mode === 'explore' && !e.target.dataset.done) { e.target.dataset.done = 1; flicker(); }
    }), { threshold: .7 });
    $$('.scene').forEach(s => { io.observe(s); seen.observe(s); });
    $$('[data-flicker]').forEach(b => flick.observe(b));
  }

  /* ======================================================================
     MODO APRESENTAÇÃO
     ====================================================================== */
  function curScene() { return $('#' + CH[S.chap].id); }
  function stepsOf(el) {
    let m = 0;
    $$('[data-step],[data-step-from]', el).forEach(x => {
      if (x.closest('[data-scroll-only]')) return;
      const v = +(x.dataset.step != null ? x.dataset.step : x.dataset.stepFrom);
      if (v > m) m = v;
    });
    return m;
  }
  function visibleChapter() {
    let best = 0;
    $$('#chapters > .scene').forEach((s, i) => { if (s.getBoundingClientRect().top <= innerHeight * .4) best = i; });
    return best;
  }
  function applyStep(prevStep) {
    const el = curScene();
    $$('#chapters > .scene').forEach(s => s.classList.toggle('is-current', s === el));
    el.classList.add('seen');
    $$('[data-step],[data-step-from]', el).forEach(x => {
      const on = x.dataset.step != null ? (+x.dataset.step === S.step) : (S.step >= +x.dataset.stepFrom);
      x.classList.toggle('on', on);
      x.classList.toggle('just', on && x.dataset.stepFrom != null && +x.dataset.stepFrom === S.step);
    });
    el.scrollTop = 0;
    onStep(CH[S.chap].id, S.step, el);
    updateHud();
    store.set('pres', { chap: S.chap, step: S.step });
  }
  function onStep(id, step, el) {
    if (id === 'story') {
      const beat = $$('.beat', el)[step - 1];
      if (beat && beat.hasAttribute('data-phone-beat')) setTimeout(() => openPhone($('#phone-pres')), 500);
      if (beat && beat.hasAttribute('data-flicker')) flicker();
    }
    if (id === 'cards' && step >= 1) { S.card = step - 1; renderViewer(); }
    if (id === 'evidence' && step === 0) requestAnimationFrame(drawThreads);
    if (id === 'reveal' && S.revealed) {
      el.classList.toggle('blood', step >= 1 && step <= 2);
      if (step === 2) { flash(); sfx('reveal'); }
      const f = $('#flip-truth');
      if (f) { f.classList.remove('is-flipped'); if (step === 6) setTimeout(() => { f.classList.add('is-flipped'); sfx('shutter'); }, 900); }
    }
  }
  function updateHud() {
    const c = CH[S.chap], max = stepsOf(curScene());
    $('#hud-n').textContent = `${c.n} / ${pad(CH.length)}`;
    $('#hud-t').textContent = available(S.chap) ? c.t : 'CLASSIFIED';
    $('#hud-dots').innerHTML = max > 0 ? Array.from({ length: max + 1 }, (_, i) => `<i class="${i === S.step ? 'on' : ''}"></i>`).join('') : '';
    const total = CH.length - 1;
    $('#hud-bar').style.width = ((S.chap + (max ? S.step / (max + 1) : 0)) / total * 100) + '%';
  }
  function goChap(i, step = 0) {
    if (!available(i)) return;
    S.chap = i; S.step = step === 'last' ? stepsOf($('#' + CH[i].id)) : step;
    applyStep();
  }
  function next() {
    const max = stepsOf(curScene());
    if (S.step < max) { S.step++; applyStep(); return; }
    if (CH[S.chap].id === 'vote' && !S.revealed) {
      toast(S.vote.locked ? 'Toque em “Abrir a revelação” para continuar. Para pular, use o menu (M).' : 'A revelação está lacrada: trave a acusação primeiro. Para pular, use o menu (M).');
      return;
    }
    let j = S.chap + 1; while (j < CH.length && !available(j)) j++;
    if (j >= CH.length) { toast('Fim da apresentação. Esc para sair.'); return; }
    goChap(j);
  }
  function prev() {
    if (S.step > 0) { S.step--; applyStep(); return; }
    let j = S.chap - 1; while (j >= 0 && !available(j)) j--;
    if (j < 0) return;
    goChap(j, 'last');
  }
  function enterPresent(fromId, opts = {}) {
    closeAll();
    const i = fromId ? idx(fromId) : visibleChapter();
    S.mode = 'present';
    root.classList.add('is-presenting');
    if (!opts.noFs && root.requestFullscreen && !document.fullscreenElement) {
      root.requestFullscreen().then(() => { S.ignoreFs = false; }).catch(() => {});
    }
    goChap(available(i) ? i : 0, opts.step || 0);
    hudWake();
  }
  function exitPresent() {
    const id = CH[S.chap].id;
    S.mode = 'explore';
    root.classList.remove('is-presenting');
    $$('#chapters > .scene').forEach(s => { s.classList.remove('is-current', 'blood'); s.scrollTop = 0; });
    $$('[data-step].on,[data-step-from].on').forEach(x => x.classList.remove('on', 'just'));
    if (document.fullscreenElement && document.exitFullscreen) { S.ignoreFs = true; document.exitFullscreen().catch(() => {}); }
    requestAnimationFrame(() => { const el = $('#' + id); if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' }); drawThreads(); });
  }
  function toggleFs() {
    if (document.fullscreenElement) { S.ignoreFs = true; document.exitFullscreen && document.exitFullscreen().catch(() => {}); }
    else if (root.requestFullscreen) root.requestFullscreen().catch(() => toast('Tela cheia indisponível aqui. Use o atalho do navegador (F11 ou Ctrl+Cmd+F).'));
    else toast('Tela cheia indisponível aqui. Use o atalho do navegador (F11 ou Ctrl+Cmd+F).');
  }
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && S.mode === 'present' && !S.ignoreFs) exitPresent();
    S.ignoreFs = false;
  });
  let hudT;
  function hudWake() { const h = $('#hud'); h.classList.remove('idle'); clearTimeout(hudT); hudT = setTimeout(() => h.classList.add('idle'), 2600); }
  ['mousemove', 'pointerdown', 'keydown'].forEach(t => document.addEventListener(t, () => { if (S.mode === 'present') hudWake(); }, { passive: true }));
  // gesto de deslizar no celular/tablet
  let tx = null, ty = null;
  document.addEventListener('touchstart', e => { if (S.mode !== 'present') return; tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (S.mode !== 'present' || tx == null || anyOpen()) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
    tx = ty = null;
  }, { passive: true });

  /* ======================================================================
     SOBREPOSIÇÕES
     ====================================================================== */
  let lastFocus = null;
  const anyOpen = () => !!$('.ov.is-open');
  function openOv(sel) {
    lastFocus = document.activeElement;
    const o = $(sel); o.classList.add('is-open');
    root.style.overflow = 'hidden';
    const f = $('.ov__close', o) || $('button', o); if (f) setTimeout(() => f.focus(), 30);
  }
  function closeOv(o) {
    o.classList.remove('is-open');
    if (!anyOpen()) { root.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  }
  function closeTop() { const os = $$('.ov.is-open'); if (!os.length) return false; closeOv(os[os.length - 1]); return true; }
  function closeAll() { $$('.ov.is-open').forEach(closeOv); }
  function openLight(src, capText) {
    $('#light-img').src = src; $('#light-img').alt = capText || '';
    $('#light-cap').innerHTML = capText ? `<b>${esc(capText)}</b>` : '';
    openOv('#ov-light');
  }
  function toggleIndex() {
    const o = $('#ov-index');
    if (o.classList.contains('is-open')) { closeOv(o); return; }
    $$('#index-list a[data-idx]').forEach(a => a.classList.toggle('is-current', S.mode === 'present' && +a.dataset.idx === S.chap));
    openOv('#ov-index');
  }
  function confirmBox(o) {
    S.confirm = o;
    $('#cf-stamp').textContent = o.stamp || 'Atenção';
    $('#cf-title').textContent = o.title;
    $('#cf-text').textContent = o.text;
    $('#cf-ok-label').textContent = o.ok;
    $('#cf-hint').textContent = o.hold ? 'Segure o botão por um segundo e meio' : '';
    openOv('#ov-confirm');
    setTimeout(() => $('#ov-confirm .btn--ghost').focus(), 40);
  }
  (function holdButton() {
    const ok = $('#cf-ok'); let t = null; const HOLD = 1500;
    const done = () => { ok.classList.remove('is-holding'); const fn = S.confirm && S.confirm.fn; S.confirm = null; closeOv($('#ov-confirm')); if (fn) fn(); };
    const start = () => { if (!S.confirm) return; if (!S.confirm.hold) { done(); return; } ok.style.setProperty('--hold', HOLD + 'ms'); ok.classList.add('is-holding'); clearTimeout(t); t = setTimeout(done, HOLD); };
    const end = () => { clearTimeout(t); ok.classList.remove('is-holding'); };
    ok.addEventListener('pointerdown', e => { e.preventDefault(); start(); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => ok.addEventListener(ev, () => { if (S.confirm && S.confirm.hold) end(); }));
    ok.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); start(); } });
    ok.addEventListener('keyup', e => { if ((e.key === 'Enter' || e.key === ' ') && S.confirm && S.confirm.hold) end(); });
    ok.addEventListener('click', e => e.preventDefault());
  })();

  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 3200); }
  function flash() { if (RM) return; const f = $('#flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }
  function flicker() { if (RM) return; const s = $('#story'); s.classList.remove('flicker'); void s.offsetWidth; s.classList.add('flicker'); sfx('flicker'); setTimeout(() => s.classList.remove('flicker'), 1700); }

  /* ---------------- celular ---------------- */
  function openPhone(ph) {
    if (!ph || ph.dataset.open) return;
    ph.dataset.open = '1'; ph.classList.remove('has-new');
    $('.phone__new', ph).hidden = true;
    const m = $('.phone__msg', ph); m.hidden = false;
    const txt = $('.txt', m), s = D.story.anonymousMessage;
    sfx('sms');
    if (RM) { txt.textContent = s; return; }
    let i = 0; const cur = document.createElement('span'); cur.className = 'cursor';
    (function type() { txt.textContent = s.slice(0, ++i); txt.appendChild(cur); if (i < s.length) setTimeout(type, 34); })();
  }

  /* ---------------- som opcional (sintetizado, sem arquivos) ---------------- */
  let AC = null;
  function sfx(kind) {
    if (!S.sound) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const a = AC, t = a.currentTime, out = a.createGain(); out.gain.value = .5; out.connect(a.destination);
      const noise = (dur, hp, vol, at) => {
        const b = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate), d = b.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
        const s = a.createBufferSource(); s.buffer = b; const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
        const g = a.createGain(); g.gain.value = vol; s.connect(f); f.connect(g); g.connect(out); s.start(at);
      };
      const tone = (type, f0, f1, dur, vol, at) => {
        const o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(f0, at); o.frequency.exponentialRampToValueAtTime(f1, at + dur);
        g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(.0001, at + dur); o.connect(g); g.connect(out); o.start(at); o.stop(at + dur + .02);
      };
      if (kind === 'shutter') { noise(.05, 2500, .8, t); noise(.07, 1800, .6, t + .08); }
      if (kind === 'sms') { tone('square', 1318, 1318, .09, .12, t); tone('square', 1568, 1568, .12, .12, t + .12); }
      if (kind === 'stamp') { tone('sine', 120, 40, .25, .9, t); noise(.06, 400, .4, t); }
      if (kind === 'reveal') { tone('sine', 70, 30, 1.6, 1, t); noise(.4, 200, .35, t); }
      if (kind === 'flicker') { for (let k = 0; k < 4; k++) noise(.03, 3000, .3, t + k * .16); }
    } catch (e) { /* sem áudio */ }
  }

  /* ======================================================================
     VOTAÇÃO E REVELAÇÃO
     ====================================================================== */
  const saveVote = () => store.set('vote', S.vote);
  function lockVote() {
    if (!S.vote.suspect) return;
    const r = $('#vote-reason'); if (r) S.vote.reason = r.value.trim();
    S.vote.locked = true;
    const d = new Date(); S.vote.lockedAt = `${pad(d.getHours())}h${pad(d.getMinutes())}`;
    saveVote(); renderVote(); sfx('stamp');
    toast('Acusação registrada.');
  }
  function unlockReveal() {
    S.revealed = true; store.set('revealed', true);
    root.classList.add('truth-open');
    remount('reveal'); remount('cards'); renderVote(); buildNav();
    if (S.mode === 'present') goChap(idx('reveal'));
    else enterPresent('reveal', { noFs: !!document.fullscreenElement });
  }
  function resetInvestigation() {
    S.vote = freshVote(); S.revealed = false;
    store.set('vote', S.vote); store.set('revealed', false);
    root.classList.remove('truth-open');
    remount('reveal'); remount('cards'); renderVote(); buildNav();
    if (S.mode === 'present') goChap(idx('vote')); else goto('vote');
    toast('Investigação reiniciada.');
  }

  /* ======================================================================
     EVENTOS
     ====================================================================== */
  const actions = {
    goto: el => goto(el.dataset.target),
    index: () => toggleIndex(),
    close: el => closeOv(el.closest('.ov')),
    present: () => { closeAll(); S.mode === 'present' ? toggleIndex() : enterPresent(); },
    'present-start': () => enterPresent('home'),
    'present-reveal': () => enterPresent('reveal'),
    exit: () => { closeAll(); exitPresent(); },
    explore: () => { closeAll(); if (S.mode === 'present') { S.chap = idx('concept'); exitPresent(); } else goto('concept'); },
    next: () => next(), prev: () => prev(), fullscreen: () => toggleFs(),
    'toggle-notes': el => { S.notes = !S.notes; store.set('notes', S.notes); root.classList.toggle('show-notes', S.notes); el.setAttribute('aria-pressed', String(S.notes)); toast(S.notes ? 'Pendências visíveis (só fora do modo apresentação).' : 'Pendências ocultas.'); },
    'toggle-sound': el => { S.sound = !S.sound; el.setAttribute('aria-pressed', String(S.sound)); if (S.sound) sfx('sms'); toast(S.sound ? 'Efeitos sonoros ligados.' : 'Efeitos sonoros desligados.'); },
    reset: () => confirmBox({ stamp: 'Reiniciar', title: 'Reiniciar a investigação?', text: 'Apaga a acusação, a justificativa e a contagem de votos deste computador e lacra a revelação de novo.', ok: 'Reiniciar', hold: false, fn: resetInvestigation }),
    filter: el => {
      const cat = el.dataset.cat;
      $$('#moodboard .chip').forEach(b => b.setAttribute('aria-pressed', String(b === el)));
      $$('#moodboard .ref').forEach(r => r.classList.toggle('dim', !!cat && !r.dataset.cats.split('|').includes(cat)));
    },
    copy: el => {
      const v = el.dataset.copy;
      try { navigator.clipboard.writeText(v).then(() => toast(v + ' copiado.'), () => toast(v)); } catch (e) { toast(v); }
    },
    'read-msg': el => openPhone(el.closest('.phone')),
    girl: el => {
      const i = +el.dataset.i;
      if (S.mode === 'present') { S.step = i + 1; applyStep(); return; }
      const d = $('#dossier-' + D.girls[i].id); if (d) d.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
    },
    card: el => {
      S.card = +el.dataset.i;
      if (S.mode === 'present') { S.step = S.card + 1; applyStep(); return; }
      renderViewer();
      if (el.classList.contains('fan__card')) $('#viewer').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
    },
    flip: () => {
      const f = $('#flip'); f.classList.toggle('is-flipped');
      const c = D.cards[S.card], back = f.classList.contains('is-flipped');
      $('#flip-side').textContent = back ? 'VERSO' : (isLocked(c) ? 'ENVELOPE LACRADO · toque em virar para ver o verso' : 'FRENTE');
    },
    'card-zoom': () => {
      const c = D.cards[S.card], back = $('#flip').classList.contains('is-flipped');
      if (!back && isLocked(c)) { toast('A carta 05 fica lacrada até a revelação.'); return; }
      const src = back ? (c.back || D.cardSpec.sharedBack) : c.front;
      if (!src) { toast('A arte desta carta ainda não foi inserida.'); return; }
      openLight(src, `Carta ${c.n} — ${c.name} · ${back ? 'verso' : 'frente'}`);
    },
    'flip-truth': () => { const f = $('#flip-truth'); if (f) { f.classList.toggle('is-flipped'); sfx('shutter'); } },
    ev: el => {
      const e = D.evidence[+el.dataset.i];
      if (S.mode === 'present') { S.step = +el.dataset.i + 1; applyStep(); return; }
      $('#ev-modal-body').innerHTML = `<div class="ev-detail">${evDetail(e)}</div>`;
      openOv('#ov-ev');
    },
    folder: () => {
      const f = $('#folder'); f.classList.toggle('is-open');
      $('#folder-btn').textContent = f.classList.contains('is-open') ? 'Fechar a pasta' : 'Abrir a pasta';
    },
    pick: el => {
      if (S.vote.locked) return;
      S.vote.suspect = el.dataset.id; saveVote();
      $$('#vote-ui .suspect').forEach(b => b.setAttribute('aria-checked', String(b === el)));
      const lk = $('#vote-ui [data-action="lock"]'); if (lk) lk.disabled = false;
    },
    tally: el => {
      const id = el.dataset.id; S.vote.tally[id] = Math.max(0, (S.vote.tally[id] || 0) + (+el.dataset.d));
      saveVote(); $('#tally').innerHTML = tallyRows();
    },
    'tally-reset': () => { S.vote.tally = { agatha: 0, tina: 0, laila: 0 }; saveVote(); $('#tally').innerHTML = tallyRows(); },
    'tally-pick': () => {
      const tot = tallyTotal(); if (!tot) { toast('Nenhum voto registrado ainda.'); return; }
      const max = Math.max.apply(null, SUSPECTS.map(g => S.vote.tally[g.id] || 0));
      const top = SUSPECTS.filter(g => (S.vote.tally[g.id] || 0) === max);
      if (top.length > 1) { toast('Empate entre ' + top.map(g => cap(g.name)).join(' e ') + '. Escolha a acusação manualmente.'); return; }
      const b = $(`#vote-ui .suspect[data-id="${top[0].id}"]`); if (b) actions.pick(b);
      toast('Acusação da turma: ' + cap(top[0].name) + '. Revise e trave.');
    },
    lock: () => lockVote(),
    'unlock-vote': () => { S.vote.locked = false; S.vote.lockedAt = null; saveVote(); renderVote(); },
    'ask-reveal': () => confirmBox({
      stamp: 'Spoiler', hold: true, ok: 'Segure para revelar',
      title: 'Abrir a revelação final?',
      text: 'Isso mostra a identidade da assassina para toda a turma. Confirme só quando a acusação estiver registrada e a apresentadora autorizar.',
      fn: unlockReveal
    })
  };

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-action]');
    if (a && !a.disabled) { const fn = actions[a.dataset.action]; if (fn) { e.preventDefault(); fn(a, e); } return; }
    const z = e.target.closest('[data-zoom]');
    if (z) { openLight(z.dataset.zoom, z.dataset.cap); return; }
    const l = e.target.closest('a[href^="#"]');
    if (l) {
      const id = l.getAttribute('href').slice(1);
      if (idx(id) >= 0) { e.preventDefault(); goto(id); }
      return;
    }
    if (e.target.classList && e.target.classList.contains('ov') && !e.target.classList.contains('confirm')) closeOv(e.target);
  });

  document.addEventListener('keydown', e => {
    const t = e.target, tag = (t.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || t.isContentEditable;
    if (e.key === 'Escape') { if (closeTop()) { e.preventDefault(); return; } if (S.mode === 'present') { e.preventDefault(); exitPresent(); } return; }
    if (typing) return;
    if (S.mode !== 'present') return;
    if ((e.key === 'm' || e.key === 'M') && !e.metaKey && !e.ctrlKey) { e.preventDefault(); toggleIndex(); return; }
    if (anyOpen()) return;
    const onControl = tag === 'button' || tag === 'a';
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); prev(); break;
      case ' ': if (!onControl) { e.preventDefault(); e.shiftKey ? prev() : next(); } break;
      case 'Home': e.preventDefault(); goChap(0); break;
      case 'End': e.preventDefault(); goChap(CH.length - 1); break;
      case 'f': case 'F': if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); toggleFs(); } break;
    }
  });

  document.addEventListener('input', e => {
    if (e.target.id === 'type-tester') { const v = e.target.value || ' '; $$('[data-sample]').forEach(s => { s.textContent = v; }); }
    if (e.target.id === 'vote-reason') { S.vote.reason = e.target.value; saveVote(); }
  });
  $('#index-list').addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a) return; e.preventDefault();
    if (a.dataset.locked) { toast('Arquivo lacrado até a revelação.'); return; }
    const i = +a.dataset.idx; closeAll();
    if (S.mode === 'present') goChap(i); else goto(CH[i].id);
  });
  // imagem que não carregou vira espaço reservado
  document.addEventListener('error', e => {
    const t = e.target; if (!t || t.tagName !== 'IMG' || t.dataset.failed || t.id === 'light-img') return;
    t.dataset.failed = '1';
    const d = document.createElement('div'); d.className = 'slot'; d.style.cssText = 'aspect-ratio:auto;height:100%;min-height:120px';
    d.innerHTML = `<span class="slot__label">Arquivo não encontrado</span><span class="slot__file">${esc(t.getAttribute('src'))}</span>`;
    t.replaceWith(d);
  }, true);
  window.addEventListener('scroll', onScroll, { passive: true });
  let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(drawThreads, 120); });

  /* ======================================================================
     INÍCIO
     ====================================================================== */
  root.style.setProperty('--card-ratio', D.cardSpec.ratio);
  root.classList.toggle('show-notes', S.notes);
  root.classList.toggle('truth-open', S.revealed);
  $('#tg-notes').setAttribute('aria-pressed', String(S.notes));
  mount();
  observe();
  onScroll();
  const ready = () => {
    root.classList.add('ready');
    drawThreads();
    const st = $('.hero__stamp'); if (st) st.classList.add('go');
    let flashed = false; try { flashed = sessionStorage.getItem('ps.f') === '1'; sessionStorage.setItem('ps.f', '1'); } catch (e) { }
    if (!flashed) setTimeout(flash, 350);
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(ready);
  setTimeout(drawThreads, 1200);
  // atalho para testes no console: PS_APP.go('cards', 2)
  window.PS_APP = { go: (id, step = 0) => { if (S.mode !== 'present') enterPresent(id, { noFs: true, step }); else goChap(idx(id), step); }, next, prev, exit: exitPresent };
  const h = (location.hash || '').slice(1);
  if (h && idx(h) > 0 && available(idx(h))) setTimeout(() => goto(h), 60);
})();
