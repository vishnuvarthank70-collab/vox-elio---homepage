/**
 * Vox & Elio — homepage interactions
 *
 * 1. Brand marquee   – duplicates the logo row so the scroll loops seamlessly
 * 2. Angle picker    – "One story. Many ways in." tabs
 * 3. Services        – category filters and previous / next scrolling
 * 4. FAQ             – one-open-at-a-time accordion
 * 5. Pixel mascots   – draws Vox and Elio in the contact section
 */
(function () {
  'use strict';

  /* 1. Brand marquee --------------------------------------------------- */
  function initMarquee() {
    var track = document.querySelector('[data-marquee]');
    if (!track) return;

    Array.prototype.slice.call(track.children).forEach(function (item) {
      var copy = item.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    });
  }

  /* 2. Angle picker ---------------------------------------------------- */
  function initAnglePicker() {
    var section = document.getElementById('angles');
    if (!section) return;

    var tabs = section.querySelectorAll('[role="tab"][data-angle]');
    var layers = section.querySelectorAll('.angle-story[data-angle], .angle-tile__value[data-angle]');
    var panel = document.getElementById('angle-panel');

    function select(angle) {
      section.setAttribute('data-angle', angle);

      tabs.forEach(function (tab) {
        var active = tab.getAttribute('data-angle') === angle;
        tab.setAttribute('aria-selected', String(active));
        if (active && panel) panel.setAttribute('aria-labelledby', tab.id);
      });

      layers.forEach(function (layer) {
        var active = layer.getAttribute('data-angle') === angle;
        layer.classList.toggle('is-active', active);
        layer.setAttribute('aria-hidden', String(!active));
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        select(tab.getAttribute('data-angle'));
      });
    });
  }

  /* 3. Services -------------------------------------------------------- */
  function initServices() {
    var track = document.getElementById('services-track');
    if (!track) return;

    var cards = track.querySelectorAll('[data-category]');
    var chips = document.querySelectorAll('[data-filter]');
    var count = document.getElementById('services-count');

    function filter(category) {
      var shown = 0;

      cards.forEach(function (card) {
        var visible = category === 'all' || card.getAttribute('data-category') === category;
        card.hidden = !visible;
        if (visible) shown += 1;
      });

      chips.forEach(function (chip) {
        chip.setAttribute('aria-selected', String(chip.getAttribute('data-filter') === category));
      });

      if (count) count.textContent = shown + ' services';
      track.scrollTo({ left: 0, behavior: 'smooth' });
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        filter(chip.getAttribute('data-filter'));
      });
    });

    document.querySelectorAll('[data-scroll]').forEach(function (button) {
      var direction = button.getAttribute('data-scroll') === 'next' ? 1 : -1;
      button.addEventListener('click', function () {
        track.scrollBy({ left: direction * Math.max(280, track.clientWidth * 0.6), behavior: 'smooth' });
      });
    });
  }

  /* 4. FAQ ------------------------------------------------------------- */
  function initFaq() {
    var list = document.querySelector('[data-accordion]');
    if (!list) return;

    var toggles = list.querySelectorAll('[aria-controls]');

    function setOpen(toggle, open) {
      toggle.setAttribute('aria-expanded', String(open));
      document.getElementById(toggle.getAttribute('aria-controls')).hidden = !open;
    }

    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var wasOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggles.forEach(function (other) {
          setOpen(other, false);
        });
        if (!wasOpen) setOpen(toggle, true);
      });
    });
  }

  /* 5. Pixel mascots --------------------------------------------------- */
  var SPRITES = {
    vox: [
      '........kk......kk..', '.......kgk......kgk.', '.......kgk......kgk.', '........kgk....kgk..',
      '.........kgk..kgk...', '.........kgkwwkgk...', '.........kgkwwkgk...', '...kkk...kgkwwkgk...',
      '..kdddk..kgkwwkgk...', '.kdekddk.kgkwwkgk...', 'bbddddk..kgkwwkgk...', '..kdddk..kgggggggk..',
      '..kmdddkkkddddddk...', '...kmddddddddddk....', '....kmmdddddddk.....', '.....kkdddddkk......',
      '......k..k..........', '.....kk..kk.........'
    ],
    elio: [
      '..............k...k.', '...............k.k..', '........kkkk...kkk..', '.......kwwwwk.kdddk.',
      '......kwwwwwwkdddddk', '.....kwwwwwwkddekddk', '..kkkkkwwwwkdddkkddk', '.kgggggkkkkddddddddk',
      'kgGGGggkdddddddddk..', 'kgGGGggkddddddddk...', '.kgggggkkddddkkk....', '..kkkkk.kk.kk.......',
      '.........k..k.......'
    ]
  };

  function initSprites() {
    document.querySelectorAll('[data-sprite]').forEach(function (sprite) {
      var rows = SPRITES[sprite.getAttribute('data-sprite')];
      if (!rows) return;

      var fragment = document.createDocumentFragment();
      rows.forEach(function (row) {
        for (var i = 0; i < 20; i++) {
          var ch = row.charAt(i) || '.';
          var pixel = document.createElement('div');
          pixel.className = 'px';
          if (ch !== '.') pixel.classList.add('px-' + ch);
          if (ch === 'g' || ch === 'G') pixel.classList.add('px--glow');
          fragment.appendChild(pixel);
        }
      });
      sprite.appendChild(fragment);
    });
  }

  initMarquee();
  initAnglePicker();
  initServices();
  initFaq();
  initSprites();
})();
