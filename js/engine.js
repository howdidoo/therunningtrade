/* ============================================================
   THE RUNNING TRADE — Engine
   ------------------------------------------------------------
   Plain vanilla JS. Reads from CONTENT (defined in content.js).
   You should not need to edit this file to change game text.

   Behaviours:
     • Intro screen with name entry, before any scene loads
     • {{name}} substitution everywhere body / dialogue text is shown
     • A "Reflection" interstitial after any choice that changes
       Trust or Exposure — the teaching moment for students
     • Per-act ambient audio + UI cues + mute toggle
     • No localStorage; no save/load. Restart returns to the intro.
   ============================================================ */

(function () {
  'use strict';

  // -------- DOM handles --------
  const el = {
    gameTitle:    document.getElementById('game-title'),
    gameSub:      document.getElementById('game-subtitle'),
    actBanner:    document.getElementById('act-banner'),
    sceneTitle:   document.getElementById('scene-title'),
    sceneBody:    document.getElementById('scene-body'),
    sceneScroll:  document.getElementById('scene-scroll'),
    sceneImg:     document.getElementById('scene-image'),
    sceneCap:     document.getElementById('scene-caption'),
    choices:      document.getElementById('choices'),
    invItems:     document.getElementById('inv-items'),
    expFill:      document.getElementById('meter-exposure'),
    expNum:       document.getElementById('meter-exposure-num'),
    trustFill:    document.getElementById('meter-trust'),
    trustNum:     document.getElementById('meter-trust-num'),
    btnRestart:   document.getElementById('btn-restart'),
    btnMute:      document.getElementById('btn-mute'),
    btnMap:       document.getElementById('btn-map'),
    btnAbout:     document.getElementById('btn-about'),
    overlay:      document.getElementById('overlay'),
    overlayTitle: document.getElementById('overlay-title'),
    overlayBody:  document.getElementById('overlay-body'),
    overlayClose: document.getElementById('overlay-close'),
    footnote:     document.getElementById('footnote'),

    sailModal:    document.getElementById('sail-modal'),
    sailTitle:    document.getElementById('sail-title'),
    sailCond:     document.getElementById('sail-conditions'),
    sailCont:     document.getElementById('sail-continue'),

    intro:        document.getElementById('intro'),
    introTitle:   document.getElementById('intro-title'),
    introSub:     document.getElementById('intro-sub'),
    introBody:    document.getElementById('intro-body'),
    introForm:    document.getElementById('intro-form'),
    introName:    document.getElementById('intro-name'),
    introNameLbl: document.getElementById('intro-name-label')
  };

  // -------- Default state --------
  const defaultState = () => ({
    name: '',
    exposure: 0,
    trust: 50,
    items: [],
    flags: {},
    currentScene: CONTENT.config.startSceneId,
    visited: {}
  });
  let state = defaultState();
  let pendingChoice = null;   // choice currently in the lesson interstitial

  // -------- Utilities --------
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[c]);
  }
  // Inline emphasis: *italic*, **strong**, plus {{name}} substitution
  function formatInline(s) {
    let out = escapeHtml(withName(s));
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return out;
  }
  function withName(s) {
    if (typeof s !== 'string') return s;
    return s.replace(/\{\{name\}\}/g, state.name || 'sir');
  }

  // -------- Meters --------
  // Apply a level-1..level-4 class so the colour deepens as the bar fills.
  function applyMeterLevel(fill, value) {
    fill.classList.remove('level-1', 'level-2', 'level-3', 'level-4');
    let lvl = 'level-1';
    if (value > 75)      lvl = 'level-4';
    else if (value > 50) lvl = 'level-3';
    else if (value > 25) lvl = 'level-2';
    fill.classList.add(lvl);
  }
  function setMeters() {
    el.expFill.style.width   = state.exposure + '%';
    el.expNum.textContent    = state.exposure;
    el.trustFill.style.width = state.trust + '%';
    el.trustNum.textContent  = state.trust;
    applyMeterLevel(el.expFill,   state.exposure);
    applyMeterLevel(el.trustFill, state.trust);
    el.expFill.classList.toggle('critical', state.exposure >= 80);
    el.trustFill.classList.toggle('critical', state.trust <= 25);
  }

  // -------- Inventory --------
  function renderInventory() {
    el.invItems.innerHTML = '';
    if (!state.items.length) {
      const li = document.createElement('li');
      li.className = 'inv-empty';
      li.textContent = '— nothing of consequence —';
      el.invItems.appendChild(li);
      return;
    }
    state.items.forEach(id => {
      const item = CONTENT.items[id];
      const li = document.createElement('li');
      li.textContent = item ? withName(item.name) : id;
      li.title = item && item.description ? withName(item.description) : '';
      el.invItems.appendChild(li);
    });
  }

  // -------- Effects & requirements --------
  function applyEffects(eff) {
    if (!eff) return;
    if (typeof eff.exposure === 'number') {
      const before = state.exposure;
      state.exposure = clamp(state.exposure + eff.exposure, 0, 100);
      // Track whether the player has ever drawn meaningful Customs
      // suspicion. We use this to gate the "exposure-falls-to-zero"
      // arrest path so that a player who has *never* been visible
      // doesn't trip the threshold from the starting state.
      if (state.exposure >= 20) state.flags.exposureSeen = true;
      // Also flag the act of *aggressively suppressing* exposure —
      // the Customs notice not the smuggler with nothing to hide
      // but the smuggler hiding *too well*.
      if (state.exposure < before) {
        state.flags.exposureSuppressed = (state.flags.exposureSuppressed || 0) + (before - state.exposure);
      }
    }
    if (typeof eff.trust === 'number') {
      state.trust = clamp(state.trust + eff.trust, 0, 100);
    }
    if (eff.addItem) {
      const ids = Array.isArray(eff.addItem) ? eff.addItem : [eff.addItem];
      ids.forEach(id => { if (!state.items.includes(id)) state.items.push(id); });
    }
    if (eff.removeItem) {
      const ids = Array.isArray(eff.removeItem) ? eff.removeItem : [eff.removeItem];
      state.items = state.items.filter(i => !ids.includes(i));
    }
    if (eff.flags) {
      Object.assign(state.flags, eff.flags);
    }
  }

  function meetsRequirements(choice) {
    if (!choice.requires) return true;
    const r = choice.requires;
    if (r.item) {
      const need = Array.isArray(r.item) ? r.item : [r.item];
      if (!need.every(id => state.items.includes(id))) return false;
    }
    if (r.flag) {
      for (const k in r.flag) {
        if (state.flags[k] !== r.flag[k]) return false;
      }
    }
    if (typeof r.minTrust    === 'number' && state.trust    <  r.minTrust)    return false;
    if (typeof r.maxTrust    === 'number' && state.trust    >  r.maxTrust)    return false;
    if (typeof r.minExposure === 'number' && state.exposure <  r.minExposure) return false;
    if (typeof r.maxExposure === 'number' && state.exposure >  r.maxExposure) return false;
    return true;
  }

  // -------- Choice rendering --------
  function renderChoices(scene) {
    el.choices.innerHTML = '';
    const choices = (scene.choices || []).filter(c => !c.hidden || c.hidden(state) === false);
    if (!choices.length) {
      if (scene.next) addChoiceButton({ text: 'Continue…', target: scene.next });
      return;
    }
    choices.forEach(addChoiceButton);
  }

  function addChoiceButton(choice) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn';
    btn.textContent = withName(choice.text);
    if (!meetsRequirements(choice)) {
      btn.disabled = true;
      btn.title = 'You cannot do this just now.';
    }
    btn.addEventListener('click', () => onChoose(choice));
    el.choices.appendChild(btn);
  }

  // -------- Choosing --------
  function onChoose(choice) {
    Audio.sfx('choice');

    const trustDelta    = (choice.effects && typeof choice.effects.trust    === 'number') ? choice.effects.trust    : 0;
    const exposureDelta = (choice.effects && typeof choice.effects.exposure === 'number') ? choice.effects.exposure : 0;
    const hasMeterChange = (trustDelta !== 0) || (exposureDelta !== 0);

    // Apply effects in either case (the lesson reflects what already happened)
    applyEffects(choice.effects);
    setMeters();
    renderInventory();

    if (hasMeterChange) {
      pendingChoice = choice;
      showLesson(choice, trustDelta, exposureDelta);
    } else {
      proceedFromChoice(choice);
    }
  }

  function proceedFromChoice(choice) {
    pendingChoice = null;
    // Threshold interrupts (skipped if next scene is itself an ending)
    const nextScene = (typeof choice.target === 'string') ? CONTENT.scenes[choice.target] : null;
    if (!nextScene || !nextScene.ending) {
      const intercept = checkThresholds();
      if (intercept) { goTo(intercept); return; }
    }
    const target = (typeof choice.target === 'function') ? choice.target(state) : choice.target;
    goTo(target);
  }

  function showLesson(choice, trustDelta, exposureDelta) {
    el.choices.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'consequence-card';

    const youChose = document.createElement('p');
    youChose.className = 'consequence-choice';
    youChose.innerHTML = '<strong>YOU CHOSE:</strong> ' + escapeHtml(withName(choice.text));
    card.appendChild(youChose);

    const lessonText = choice.lesson
      ? withName(choice.lesson)
      : 'Your decision has shifted your standing in the trade.';
    const lesson = document.createElement('p');
    lesson.className = 'consequence-lesson';
    lesson.innerHTML = formatInline(lessonText);
    card.appendChild(lesson);

    const deltas = document.createElement('div');
    deltas.className = 'consequence-deltas';
    if (exposureDelta !== 0) deltas.appendChild(makeDeltaChip('Exposure', exposureDelta, 'exposure'));
    if (trustDelta    !== 0) deltas.appendChild(makeDeltaChip('Trust',    trustDelta,    'trust'));
    card.appendChild(deltas);

    const cont = document.createElement('button');
    cont.type = 'button';
    cont.className = 'choice-btn consequence-continue';
    cont.textContent = 'Continue…';
    cont.addEventListener('click', () => proceedFromChoice(choice));
    card.appendChild(cont);

    el.choices.appendChild(card);
  }

  function makeDeltaChip(label, delta, kind) {
    const chip = document.createElement('span');
    const dir = delta > 0 ? 'up' : 'down';
    chip.className = 'delta-chip ' + kind + ' ' + dir;
    const lbl = document.createElement('span');
    lbl.className = 'delta-label';
    lbl.textContent = label.toUpperCase();
    const num = document.createElement('span');
    num.className = 'delta-num';
    num.textContent = (delta > 0 ? '+' : '') + delta;
    chip.appendChild(lbl);
    chip.appendChild(num);
    return chip;
  }

  // -------- Threshold interrupts --------
  // Three automatic routes:
  //   * Exposure ≥ 100 → an information is laid in the Exchequer. The
  //     player is now offered the full Customs-pursuit sequence.
  //   * Trust ≤ 15    → confederates sell the player to save themselves.
  //   * Exposure ≤ 0 *after* having risen above 20 → the Customs notice
  //     the smuggler who is hiding too well. Smugglers who methodically
  //     suppressed all trace of themselves (heavy bribery, false manifests,
  //     reconnoitring officers) drew Customs scrutiny precisely *because*
  //     they were so invisible. Riding officers were dispatched to bring
  //     them in for examination.
  function checkThresholds() {
    if (state.exposure >= 100 && !state.flags.customsPursuit) {
      state.flags.customsPursuit = true;
      return 'auto_customs_pursuit';
    }
    if (state.exposure <= 0 && state.flags.exposureSeen && !state.flags.customsPursuit
        && (state.flags.exposureSuppressed || 0) >= 18) {
      state.flags.customsPursuit = true;
      state.flags.suppressionPursuit = true;
      return 'auto_customs_pursuit';
    }
    if (state.trust <= 15 && !state.flags.betrayedAuto) {
      state.flags.betrayedAuto = true;
      return 'auto_betrayed';
    }
    return null;
  }

  // -------- Body rendering --------
  function renderBody(body) {
    el.sceneBody.innerHTML = '';
    if (!body) return;
    const arr = Array.isArray(body) ? body : [body];
    arr.forEach(node => {
      if (typeof node === 'string') {
        const p = document.createElement('p');
        p.innerHTML = formatInline(node);
        el.sceneBody.appendChild(p);
      } else if (node && node.dlg) {
        const p = document.createElement('p');
        p.className = 'dlg';
        p.innerHTML = '<strong>' + escapeHtml(withName(node.dlg)) + ':</strong> ' + formatInline(node.text);
        el.sceneBody.appendChild(p);
      } else if (node && node.html) {
        const p = document.createElement('p');
        p.innerHTML = node.html.replace(/\{\{name\}\}/g, escapeHtml(state.name || 'sir'));
        el.sceneBody.appendChild(p);
      }
    });
  }

  // -------- Scene loader --------
  function goTo(sceneId) {
    const scene = CONTENT.scenes[sceneId];
    if (!scene) {
      console.error('Missing scene:', sceneId);
      el.sceneTitle.textContent = 'Lost Page';
      el.sceneBody.innerHTML = '<p>The page is torn from the ledger. (Scene <code>' + sceneId + '</code> is missing.)</p>';
      el.choices.innerHTML = '';
      return;
    }
    state.currentScene = sceneId;
    state.visited[sceneId] = (state.visited[sceneId] || 0) + 1;

    if (scene.onEnter) {
      try { scene.onEnter(state); } catch (e) { console.warn('onEnter failed:', e); }
    }

    // Banner
    const act = CONTENT.acts && CONTENT.acts[scene.act];
    if (act) el.actBanner.textContent = act.banner || ('Act ' + scene.act);

    // Title + caption
    el.sceneTitle.textContent = withName(scene.title || '');
    el.sceneCap.textContent   = withName(scene.caption || '');

    // Picture (graceful fallback)
    const fallback = (CONTENT.config && CONTENT.config.fallbackImage) || 'assets/images/map.jpg';
    el.sceneImg.onerror = function () { this.onerror = null; this.src = fallback; };
    el.sceneImg.src = scene.image || fallback;
    el.sceneImg.alt = withName(scene.title || 'Scene');

    // Body + choices + meters + inventory
    renderBody(scene.body);
    renderChoices(scene);
    setMeters();
    renderInventory();

    // Animate
    el.sceneScroll.classList.remove('scene-fade');
    void el.sceneScroll.offsetWidth;
    el.sceneScroll.classList.add('scene-fade');

    // Audio: ambient by act, then per-scene override (if any), then UI cue
    Audio.setAct(scene.act);
    Audio.applyScene(scene);
    // The default ui_scene cue is only played if the scene didn't supply
    // its own one-shot sfx (so we don't double up).
    if (!scene.sfx) Audio.sfx('scene');

    if (scene.ending) {
      Audio.sfx('ending');
      showEnding(scene);
    }

    // Sailing interstitial: when the player puts to sea, show the chart
    // and the conditions of wind, tide, and weather before play resumes.
    if (scene.sailing) {
      showSailingModal(scene);
    }
  }

  // -------- Sailing modal --------
  function showSailingModal(scene) {
    const s = scene.sailing || {};
    el.sailTitle.textContent = withName(s.title || 'The Vessel Puts Out');
    el.sailCond.innerHTML = formatInline(withName(s.text || ''));
    el.sailModal.removeAttribute('hidden');
  }
  function hideSailingModal() {
    el.sailModal.setAttribute('hidden', '');
  }

  // -------- Map overlay --------
  function showMap() {
    el.overlay.removeAttribute('hidden');
    const card = el.overlay.querySelector('.overlay-card');
    card.classList.remove('ending-card');
    card.classList.add('map-card');
    el.overlayTitle.textContent = 'A Chart of the Channel';
    el.overlayBody.innerHTML =
      '<div class="map-overlay"><img src="assets/images/map.jpg" alt="A new chart of the English Channel and adjacent coasts" /></div>' +
      '<p style="margin-top:10px;font-family:var(--font-sc);font-style:italic;color:var(--ink-soft);text-align:center;">' +
      'A new chart of the English Channel and adjacent coasts.</p>';
  }

  // -------- Ending overlay --------
  function showEnding(scene) {
    el.overlay.removeAttribute('hidden');
    const card = el.overlay.querySelector('.overlay-card');
    card.classList.add('ending-card');
    card.classList.remove('map-card');
    el.overlayTitle.textContent = withName(scene.endingTitle || 'An Ending');
    el.overlayBody.innerHTML =
      '<div class="ending-flag">' + escapeHtml(withName(scene.endingFlag || 'FINIS')) + '</div>' +
      (scene.endingHtml ? scene.endingHtml.replace(/\{\{name\}\}/g, escapeHtml(state.name || 'sir')) : '<p>The tale is told.</p>') +
      '<p style="margin-top:14px;font-family:var(--font-sc);font-style:italic;color:var(--ink-soft);">' +
      'Press <em>Restart</em> to begin again, or <em>About</em> for the historical note.</p>';
  }

  // -------- About overlay --------
  function showAbout() {
    el.overlay.removeAttribute('hidden');
    const card = el.overlay.querySelector('.overlay-card');
    card.classList.remove('ending-card');
    card.classList.remove('map-card');
    el.overlayTitle.textContent = 'A Note from the Author';
    el.overlayBody.innerHTML = (CONTENT.config && CONTENT.config.aboutHtml) || '<p>—</p>';
  }

  // -------- Restart --------
  function restart() {
    state = defaultState();
    el.overlay.setAttribute('hidden', '');
    showIntro();
    flashFootnote('Restarted.');
  }

  let footTimer;
  const baseFootnote = 'An educational game — press M to mute.';
  function flashFootnote(msg) {
    el.footnote.textContent = msg;
    clearTimeout(footTimer);
    footTimer = setTimeout(() => { el.footnote.textContent = baseFootnote; }, 1800);
  }

  // -------- Audio module --------
  // The engine supports THREE layers of audio:
  //   1. Per-act ambient (long looping bed, per Act number).
  //   2. Per-scene ambient  — if a scene defines `audio: 'path.mp3'`
  //      or `audio: { ambient: 'path.mp3', volume: 0.25 }`, it OVERRIDES
  //      the act ambient for that scene. Leaving the scene returns to
  //      the act ambient. This lets you score individual scenes (a
  //      court clerk's pen, a stable yard at three in the morning, etc.).
  //   3. One-shot UI cues (choice / scene / ending).
  // Per-scene SFX may also be specified as `sfx: 'path.mp3'`, played
  // when the scene loads instead of (or in addition to) the default
  // ui_scene cue.
  const Audio = {
    muted: false,
    ambient: null,
    currentAct: null,
    currentSceneAudio: null,
    sceneAmbient: null,
    sfxBuffers: {},
    primed: false,    // browsers block autoplay until first user gesture

    cfg() {
      return (CONTENT.config && CONTENT.config.audio) || { ambient: {}, sfx: {} };
    },
    setAct(actNum) {
      if (!this.primed) return;            // wait for first interaction
      // If a scene-specific ambient is playing, don't restart the act ambient
      // just yet — `applyScene` decides how the two layers interact.
      if (this.currentAct === actNum) return;
      const path = (this.cfg().ambient || {})[actNum];
      this.currentAct = actNum;
      if (this.ambient) { try { this.ambient.pause(); } catch (e) {} }
      if (!path) { this.ambient = null; return; }
      const a = new window.Audio(path);
      a.loop = true;
      a.volume = 0.22;
      a.muted = this.muted;
      // If a scene-specific bed is currently playing, keep the act
      // ambient prepared but silent (we'll un-mute it when we leave
      // the scene). Otherwise, play it.
      if (this.sceneAmbient) {
        a.muted = true;
      } else {
        a.play().catch(() => {});
      }
      this.ambient = a;
    },
    // Per-scene ambient: takes a path or an object {ambient, volume, loop}.
    applyScene(scene) {
      if (!this.primed) return;
      const raw = scene && scene.audio;
      const cfg = (typeof raw === 'string') ? { ambient: raw } : (raw || null);
      const newPath = cfg && cfg.ambient ? cfg.ambient : null;

      if (newPath) {
        // Same scene-specific track already playing? do nothing.
        if (this.currentSceneAudio === newPath && this.sceneAmbient) return;

        // Stop any previous scene-ambient.
        if (this.sceneAmbient) { try { this.sceneAmbient.pause(); } catch (e) {} }

        // Mute the act ambient while the scene track plays.
        if (this.ambient) { try { this.ambient.muted = true; } catch (e) {} }

        const a = new window.Audio(newPath);
        a.loop = (cfg.loop !== false);
        a.volume = (typeof cfg.volume === 'number') ? cfg.volume : 0.26;
        a.muted = this.muted;
        a.play().catch(() => {});
        this.sceneAmbient = a;
        this.currentSceneAudio = newPath;
      } else {
        // No scene-specific audio: stop any prior scene ambient, restore
        // the act ambient.
        if (this.sceneAmbient) {
          try { this.sceneAmbient.pause(); } catch (e) {}
          this.sceneAmbient = null;
          this.currentSceneAudio = null;
        }
        if (this.ambient) {
          try {
            this.ambient.muted = this.muted;
            if (this.ambient.paused) this.ambient.play().catch(() => {});
          } catch (e) {}
        }
      }

      // Optional scene-specific one-shot
      if (scene && scene.sfx) {
        try {
          const s = new window.Audio(scene.sfx);
          s.volume = 0.45;
          s.muted = this.muted;
          s.play().catch(() => {});
        } catch (e) {}
      }
    },
    sfx(name) {
      if (this.muted || !this.primed) return;
      const path = (this.cfg().sfx || {})[name];
      if (!path) return;
      let a = this.sfxBuffers[name];
      if (!a) { a = new window.Audio(path); a.volume = 0.4; this.sfxBuffers[name] = a; }
      try { a.currentTime = 0; a.play().catch(() => {}); } catch (e) {}
    },
    prime() {
      // Called on first user gesture (intro begin or first choice click)
      if (this.primed) return;
      this.primed = true;
      // re-trigger ambient for the current act now that autoplay is allowed
      const scene = CONTENT.scenes[state.currentScene] || {};
      this.currentAct = null;
      if (scene.act) this.setAct(scene.act);
      this.applyScene(scene);
    },
    toggleMute() {
      this.muted = !this.muted;
      if (this.ambient) this.ambient.muted = this.muted;
      if (this.sceneAmbient) this.sceneAmbient.muted = this.muted;
      el.btnMute.textContent = this.muted ? 'Unmute' : 'Mute';
      flashFootnote(this.muted ? 'Audio muted.' : 'Audio on.');
    }
  };

  // -------- Intro screen --------
  function showIntro() {
    el.intro.removeAttribute('hidden');
    const cfg = (CONTENT.config && CONTENT.config.intro) || {};
    if (cfg.title)    el.introTitle.textContent = cfg.title;
    if (cfg.subtitle) el.introSub.innerHTML = cfg.subtitle;
    if (cfg.namePrompt) el.introNameLbl.textContent = cfg.namePrompt;

    // Body lines (array of strings or {html} blocks)
    el.introBody.innerHTML = '';
    const body = cfg.body || [];
    body.forEach(node => {
      if (typeof node === 'string') {
        const p = document.createElement('p');
        // intro body shouldn't show {{name}} — it's where you ENTER the name
        p.innerHTML = (function(s) {
          let out = escapeHtml(s);
          out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
          out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
          return out;
        })(node);
        el.introBody.appendChild(p);
      } else if (node && node.html) {
        const div = document.createElement('div');
        div.innerHTML = node.html;
        el.introBody.appendChild(div);
      }
    });

    el.introName.value = '';
    setTimeout(() => el.introName.focus(), 50);
  }

  function hideIntro() { el.intro.setAttribute('hidden', ''); }

  function startGameAfterIntro(name) {
    state.name = name;
    Audio.prime();
    hideIntro();
    goTo(CONTENT.config.startSceneId);
  }

  // -------- Init --------
  function init() {
    if (CONTENT.config) {
      if (CONTENT.config.title)    el.gameTitle.textContent = CONTENT.config.title;
      if (CONTENT.config.subtitle) el.gameSub.innerHTML = CONTENT.config.subtitle;
    }

    el.btnRestart.addEventListener('click', () => {
      if (confirm('Begin again from the start? Your current run will be lost.')) restart();
    });
    el.btnMute.addEventListener('click', () => Audio.toggleMute());
    el.btnAbout.addEventListener('click', showAbout);
    el.btnMap.addEventListener('click', showMap);
    el.overlayClose.addEventListener('click', () => el.overlay.setAttribute('hidden', ''));
    el.sailCont.addEventListener('click', hideSailingModal);

    // M key toggles mute
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'm' || e.key === 'M') && !e.target.matches('input, textarea')) {
        Audio.toggleMute();
      }
    });

    // Intro form
    el.introForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let raw = (el.introName.value || '').trim();
      if (!raw) raw = 'Bowden';
      // Tidy: collapse whitespace, trim
      raw = raw.replace(/\s+/g, ' ').slice(0, 32);
      startGameAfterIntro(raw);
    });

    setMeters();
    renderInventory();
    showIntro();
    el.footnote.textContent = baseFootnote;
  }

  // Console hook for development
  window.RT = {
    state: () => state,
    go: (id) => goTo(id),
    restart: restart,
    set: (k, v) => { state[k] = v; setMeters(); renderInventory(); },
    skipIntro: (name) => startGameAfterIntro(name || 'Bowden')
  };

  document.addEventListener('DOMContentLoaded', init);
})();
