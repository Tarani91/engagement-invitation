/**
 * LUXURY ENGAGEMENT INVITATION - SCRIPT
 * Word-by-Word Announcement + Letter-by-Letter Couple Reveal (BLESSY & RUFUS)
 */

(function () {
  'use strict';

  // State
  let isOpen = false;
  let isAnimating = false;
  let soundEnabled = true;
  let audioCtx = null;
  let currentStage = 0; // 0: Announcement, 1: Couple (BLESSY & RUFUS), 2: Date & Time

  // DOM Elements
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const waxSealWrapper = document.getElementById('waxSealWrapper');
  const doorLeft = document.getElementById('doorLeft');
  const doorRight = document.getElementById('doorRight');
  const tapHint = document.getElementById('tapHint');
  const centerSeam = document.getElementById('centerSeam');
  const innerCard = document.getElementById('innerCard');
  const scrollTrack = document.getElementById('scrollTrack');
  const scrollPrompt = document.getElementById('scrollPrompt');
  const promptText = document.getElementById('promptText');
  const promptArrow = document.getElementById('promptArrow');
  const layerAnnouncement = document.getElementById('layerAnnouncement');
  const layerCouple = document.getElementById('layerCouple');
  const sectionDateTime = document.getElementById('sectionDateTime');
  const sectionLocation = document.getElementById('sectionLocation');
  const locationContentStage = document.getElementById('locationContentStage');
  const locationCard = document.getElementById('locationCard');
  const sectionCountdown = document.getElementById('sectionCountdown');
  const countdownContentStage = document.getElementById('countdownContentStage');
  const countdownCard = document.getElementById('countdownCard');
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');
  const sectionClosing = document.getElementById('sectionClosing');
  const closingCard = document.getElementById('closingCard');
  const btnCloseEnvelope = document.getElementById('btnCloseEnvelope');
  const coupleNamesWrap = document.getElementById('coupleNamesWrap');
  const saveWords = document.querySelectorAll('.save-word');
  const rollingCounterBoard = document.getElementById('rollingCounterBoard');
  const dateDaySubtitle = document.getElementById('dateDaySubtitle');
  const dateTimeClean = document.getElementById('dateTimeClean');
  const reelDay = document.getElementById('reelDay');
  const reelMonth = document.getElementById('reelMonth');
  const reelYear = document.getElementById('reelYear');
  let counterRolled = false;
  const floatingControls = document.getElementById('floatingControls');
  const replayBtn = document.getElementById('replayBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIconOn = document.getElementById('soundIconOn');
  const soundIconOff = document.getElementById('soundIconOff');
  const canvas = document.getElementById('particles-canvas');

  // =========================================================================
  // AUDIO SYNTHESIZER (Web Audio API)
  // =========================================================================
  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playWaxBreakSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);

      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.09);

      const bufferSize = audioCtx.sampleRate * 0.16;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(1.8, now);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.28, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noise.start(now);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  function playPaperUnfoldSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime + 0.04;
      const bufferSize = audioCtx.sampleRate * 0.4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.22;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.22);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.4);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  function playGoldenChimeSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime + 0.38;
      const freqs = [587.33, 880.0, 1174.66];
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.001, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.07 / (idx + 1), now + idx * 0.07 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 1.1);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 1.2);
      });
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // =========================================================================
  // DATE SECTION CHOREOGRAPHED REVEAL (Save the Date -> Date -> Day -> Time)
  // =========================================================================
  function playDateRevealSequence() {
    if (!window.gsap) return;

    // Reset initial states
    gsap.killTweensOf([saveWords, rollingCounterBoard, dateDaySubtitle, dateTimeClean, reelDay, reelMonth, reelYear]);
    gsap.set(saveWords, { opacity: 0, y: 14 });
    gsap.set(rollingCounterBoard, { opacity: 0, y: 16 });
    gsap.set(dateDaySubtitle, { opacity: 0, y: 12 });
    gsap.set(dateTimeClean, { opacity: 0, y: 12 });
    gsap.set([reelDay, reelMonth, reelYear], { y: 0 });

    const tl = gsap.timeline();

    // 1. "Save the Date" appears WORD BY WORD (Save ... the ... Date)
    tl.to(saveWords, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.18,
      ease: 'sine.out'
    }, 0.25);

    // 2. Then the Date counter board appears
    tl.to(rollingCounterBoard, {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: 'sine.out'
    }, 0.9);

    // 2b. The rolling counter reels spin with momentum and settle on 03 • DECEMBER • 2026
    const itemHeight = 56;
    tl.to(reelDay, {
      y: -(5 * itemHeight),
      duration: 1.8,
      ease: 'power3.out'
    }, 1.0);

    tl.to(reelMonth, {
      y: -(4 * itemHeight),
      duration: 2.1,
      ease: 'power3.out'
    }, 1.12);

    tl.to(reelYear, {
      y: -(4 * itemHeight),
      duration: 2.4,
      ease: 'power3.out'
    }, 1.25);

    // 3. Then the Day appears ("THURSDAY")
    tl.to(dateDaySubtitle, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'sine.out'
    }, 2.0);

    // 4. Then the Time appears ("11:00 AM")
    tl.to(dateTimeClean, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'sine.out'
    }, 2.35);
  }

  function resetDateRevealSequence() {
    if (!window.gsap) return;
    gsap.killTweensOf([saveWords, rollingCounterBoard, dateDaySubtitle, dateTimeClean, reelDay, reelMonth, reelYear]);
    gsap.set(saveWords, { opacity: 0, y: 14 });
    gsap.set(rollingCounterBoard, { opacity: 0, y: 16 });
    gsap.set(dateDaySubtitle, { opacity: 0, y: 12 });
    gsap.set(dateTimeClean, { opacity: 0, y: 12 });
    gsap.set([reelDay, reelMonth, reelYear], { y: 0 });
    counterRolled = false;
  }

  // =========================================================================
  // MULTI-STAGE STORYTELLING ENGINE
  // Stage 0: Announcement -> Stage 1: BLESSY & RUFUS -> Stage 2: Date & Time -> Stage 3: Venue -> Stage 4: Countdown -> Stage 5: Blessing
  // =========================================================================
  function updateNavUI(stage) {
    if (promptText) {
      if (stage === 0) promptText.textContent = 'SCROLL TO REVEAL';
      else if (stage === 1) promptText.textContent = 'SCROLL FOR DATE & TIME';
      else if (stage === 2) promptText.textContent = 'SCROLL FOR VENUE';
      else if (stage === 3) promptText.textContent = 'SCROLL FOR COUNTDOWN';
      else if (stage === 4) promptText.textContent = 'SCROLL FOR BLESSING';
      else if (stage === 5) promptText.textContent = 'CLOSE & REPLAY';
    }
    if (promptArrow) {
      if (stage === 5) {
        promptArrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>';
      } else {
        promptArrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>';
      }
    }
  }

  // =========================================================================
  // LOCATION SECTION CHOREOGRAPHED ENTRY TRANSITION
  // =========================================================================
  function playLocationRevealSequence() {
    if (!window.gsap) return;

    const locationHeading = document.getElementById('locationHeading');
    const locationKicker = document.getElementById('locationKicker');
    const locationCard = document.getElementById('locationCard');
    const venuePinBadge = document.getElementById('venuePinBadge');
    const venueName = document.getElementById('venueName');
    const venueCity = document.getElementById('venueCity');
    const venueDivider = document.getElementById('venueDivider');
    const venueAddress = document.getElementById('venueAddress');
    const btnDirections = document.getElementById('btnDirections');

    gsap.killTweensOf([
      locationHeading, locationKicker, locationCard,
      venuePinBadge, venueName, venueCity, venueDivider, venueAddress, btnDirections
    ]);

    const tl = gsap.timeline();

    // 1. "The Venue" script heading drifts gracefully down
    if (locationHeading) {
      tl.fromTo(locationHeading,
        { opacity: 0, y: -22, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power2.out' },
        0.1
      );
    }

    // 2. "JOIN US AT" kicker fades in
    if (locationKicker) {
      tl.fromTo(locationKicker,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'sine.out' },
        0.28
      );
    }

    // 3. Location glassmorphic card blooms up with depth
    if (locationCard) {
      tl.fromTo(locationCard,
        { opacity: 0, y: 35, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
        0.38
      );
    }

    // 4. Pin icon drops in with bouncy spring
    if (venuePinBadge) {
      tl.fromTo(venuePinBadge,
        { opacity: 0, scale: 0.3, rotation: -25 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2.2)' },
        0.6
      );
    }

    // 5. Kingston Residency & Bangalore stagger in
    if (venueName) {
      tl.fromTo(venueName,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'sine.out' },
        0.75
      );
    }
    if (venueCity) {
      tl.fromTo(venueCity,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'sine.out' },
        0.88
      );
    }

    // 6. Divider diamond & Address
    if (venueDivider) {
      tl.fromTo(venueDivider,
        { opacity: 0, scaleX: 0.2 },
        { opacity: 1, scaleX: 1, duration: 0.5, ease: 'sine.out' },
        0.98
      );
    }
    if (venueAddress) {
      tl.fromTo(venueAddress,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'sine.out' },
        1.08
      );
    }

    // 7. Royal Gold Foil Button pops in with royal spring
    if (btnDirections) {
      tl.fromTo(btnDirections,
        { opacity: 0, y: 18, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.8)' },
        1.22
      );
    }
  }

  function resetLocationRevealSequence() {
    if (!window.gsap) return;
    const elements = [
      document.getElementById('locationHeading'),
      document.getElementById('locationKicker'),
      document.getElementById('locationCard'),
      document.getElementById('venuePinBadge'),
      document.getElementById('venueName'),
      document.getElementById('venueCity'),
      document.getElementById('venueDivider'),
      document.getElementById('venueAddress'),
      document.getElementById('btnDirections')
    ].filter(Boolean);

    gsap.killTweensOf(elements);
  }

  // =========================================================================
  // COUNTDOWN SECTION CHOREOGRAPHED ENTRY TRANSITION
  // =========================================================================
  function playCountdownRevealSequence() {
    if (!window.gsap) return;

    const heading = document.getElementById('countdownHeading');
    const kicker = document.getElementById('countdownKicker');
    const card = document.getElementById('countdownCard');
    const units = document.querySelectorAll('.countdown-unit');
    const separators = document.querySelectorAll('.countdown-separator');
    const divider = document.getElementById('countdownDivider');
    const tagline = document.getElementById('countdownTagline');
    const coupleSign = document.getElementById('countdownCoupleSign');

    gsap.killTweensOf([heading, kicker, card, units, separators, divider, tagline, coupleSign]);

    const tl = gsap.timeline();

    // 1. Heading "Counting Down" drifts down gracefully
    if (heading) {
      tl.fromTo(heading,
        { opacity: 0, y: -22, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power2.out' },
        0.1
      );
    }

    // 2. Kicker "FOREVER BEGINS IN"
    if (kicker) {
      tl.fromTo(kicker,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'sine.out' },
        0.28
      );
    }

    // 3. Glassmorphic card blooms up
    if (card) {
      tl.fromTo(card,
        { opacity: 0, y: 35, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
        0.38
      );
    }

    // 4. Countdown units spring in with stagger
    if (units && units.length > 0) {
      tl.fromTo(units,
        { opacity: 0, y: 18, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.09, ease: 'back.out(2)' },
        0.65
      );
    }

    if (separators && separators.length > 0) {
      tl.fromTo(separators,
        { opacity: 0, scale: 0.5 },
        { opacity: 0.85, scale: 1, duration: 0.5, stagger: 0.08, ease: 'sine.out' },
        0.75
      );
    }

    // 5. Divider
    if (divider) {
      tl.fromTo(divider,
        { opacity: 0, scaleX: 0.2 },
        { opacity: 1, scaleX: 1, duration: 0.5, ease: 'sine.out' },
        0.95
      );
    }

    // 6. Tagline & Couple Signature
    if (tagline) {
      tl.fromTo(tagline,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'sine.out' },
        1.05
      );
    }

    if (coupleSign) {
      tl.fromTo(coupleSign,
        { opacity: 0, y: 12, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out' },
        1.18
      );
    }
  }

  function resetCountdownRevealSequence() {
    if (!window.gsap) return;
    const elements = [
      document.getElementById('countdownHeading'),
      document.getElementById('countdownKicker'),
      document.getElementById('countdownCard'),
      document.querySelectorAll('.countdown-unit'),
      document.querySelectorAll('.countdown-separator'),
      document.getElementById('countdownDivider'),
      document.getElementById('countdownTagline'),
      document.getElementById('countdownCoupleSign')
    ];
    gsap.killTweensOf(elements);
  }

  // =========================================================================
  // SECTION 5: BLESSING QUOTE & CLOSING REVEAL SEQUENCE
  // =========================================================================
  function playClosingRevealSequence() {
    if (!window.gsap) return;

    const heading = document.getElementById('closingHeading');
    const kicker = document.getElementById('closingKicker');
    const card = document.getElementById('closingCard');
    const badge = document.getElementById('scriptureBadge');
    const quote = document.getElementById('closingQuote');
    const ref = document.getElementById('closingReference');
    const divider = document.getElementById('closingDivider');
    const message = document.getElementById('closingMessage');
    const signature = document.getElementById('closingSignature');
    const closeBtn = document.getElementById('btnCloseEnvelope');

    gsap.killTweensOf([heading, kicker, card, badge, quote, ref, divider, message, signature, closeBtn]);

    const tl = gsap.timeline();

    // 1. Heading "With Blessings"
    if (heading) {
      tl.fromTo(heading,
        { opacity: 0, y: -22, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power2.out' },
        0.1
      );
    }

    // 2. Kicker "A SACRED PROMISE"
    if (kicker) {
      tl.fromTo(kicker,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'sine.out' },
        0.28
      );
    }

    // 3. Closing card blooms up
    if (card) {
      tl.fromTo(card,
        { opacity: 0, y: 35, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
        0.38
      );
    }

    // 4. Scripture badge drops in with bouncy spring
    if (badge) {
      tl.fromTo(badge,
        { opacity: 0, scale: 0.3, rotation: -20 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.55, ease: 'back.out(2)' },
        0.62
      );
    }

    // 5. Scripture Quote & Reference
    if (quote) {
      tl.fromTo(quote,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'sine.out' },
        0.75
      );
    }
    if (ref) {
      tl.fromTo(ref,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'sine.out' },
        0.9
      );
    }

    // 6. Divider line
    if (divider) {
      tl.fromTo(divider,
        { opacity: 0, scaleX: 0.2 },
        { opacity: 1, scaleX: 1, duration: 0.5, ease: 'sine.out' },
        1.0
      );
    }

    // 7. Message & Signature
    if (message) {
      tl.fromTo(message,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'sine.out' },
        1.1
      );
    }
    if (signature) {
      tl.fromTo(signature,
        { opacity: 0, y: 14, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out' },
        1.25
      );
    }

    // 8. Close & Replay Button
    if (closeBtn) {
      tl.fromTo(closeBtn,
        { opacity: 0, y: 16, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'back.out(1.8)' },
        1.4
      );
    }
  }

  function resetClosingRevealSequence() {
    if (!window.gsap) return;
    const elements = [
      document.getElementById('closingHeading'),
      document.getElementById('closingKicker'),
      document.getElementById('closingCard'),
      document.getElementById('scriptureBadge'),
      document.getElementById('closingQuote'),
      document.getElementById('closingReference'),
      document.getElementById('closingDivider'),
      document.getElementById('closingMessage'),
      document.getElementById('closingSignature'),
      document.getElementById('btnCloseEnvelope')
    ];
    gsap.killTweensOf(elements);
  }

  // =========================================================================
  // LIVE COUNTDOWN TIMER
  // Real-time calculation towards Engagement Ceremony
  // =========================================================================
  function updateCountdownTimer() {
    const configTarget = (window.INVITATION_CONFIG && window.INVITATION_CONFIG.event && window.INVITATION_CONFIG.event.targetDate) || '2026-12-03T11:00:00';
    const targetTime = new Date(configTarget).getTime();
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      if (cdDays) cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMins) cdMins.textContent = '00';
      if (cdSecs) cdSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMins) cdMins.textContent = String(mins).padStart(2, '0');
    if (cdSecs) cdSecs.textContent = String(secs).padStart(2, '0');
  }

  setInterval(updateCountdownTimer, 1000);
  updateCountdownTimer();

  function setStage(stage) {
    if (currentStage === stage) return;
    currentStage = stage;

    updateNavUI(stage);

    const letters = coupleNamesWrap ? coupleNamesWrap.querySelectorAll('.letter') : [];
    const allWords = layerAnnouncement ? layerAnnouncement.querySelectorAll('.word') : [];

    if (stage === 0) {
      // Stage 0: Announcement
      innerCard.classList.remove('show-couple', 'show-datetime', 'show-location', 'show-countdown', 'show-closing');
      resetDateRevealSequence();
      resetLocationRevealSequence();
      resetCountdownRevealSequence();
      resetClosingRevealSequence();

      if (window.gsap && allWords.length > 0) {
        gsap.to(allWords, { opacity: 1, y: 0, duration: 0.65, stagger: 0.04, ease: 'sine.out' });
      }

      if (window.gsap && letters.length > 0) {
        gsap.killTweensOf(letters);
        gsap.to(letters, {
          opacity: 0,
          y: 12,
          scale: 0.95,
          duration: 0.35,
          ease: 'sine.in'
        });
      }

    } else if (stage === 1) {
      // Stage 1: BLESSY & RUFUS
      innerCard.classList.add('show-couple');
      innerCard.classList.remove('show-datetime', 'show-location', 'show-countdown', 'show-closing');
      resetDateRevealSequence();
      resetLocationRevealSequence();
      resetCountdownRevealSequence();
      resetClosingRevealSequence();

      playGoldenChimeSound();
      if (window.gsap && letters.length > 0) {
        gsap.killTweensOf(letters);
        gsap.fromTo(letters,
          { opacity: 0, y: 16, scale: 0.94 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.9, 
            stagger: 0.1, 
            ease: 'sine.out' 
          }
        );
      } else {
        letters.forEach((l, idx) => {
          setTimeout(() => {
            l.style.opacity = '1';
            l.style.transform = 'translateY(0) scale(1)';
          }, idx * 100);
        });
      }

    } else if (stage === 2) {
      // Stage 2: Date & Time (For date.jpg)
      innerCard.classList.add('show-couple', 'show-datetime');
      innerCard.classList.remove('show-location', 'show-countdown', 'show-closing');
      resetLocationRevealSequence();
      resetCountdownRevealSequence();
      resetClosingRevealSequence();

      playGoldenChimeSound();
      if (!counterRolled) {
        counterRolled = true;
        playDateRevealSequence();
      }

    } else if (stage === 3) {
      // Stage 3: Venue & Location (map background.jpg)
      innerCard.classList.add('show-couple', 'show-datetime', 'show-location');
      innerCard.classList.remove('show-countdown', 'show-closing');
      resetCountdownRevealSequence();
      resetClosingRevealSequence();

      playGoldenChimeSound();
      playLocationRevealSequence();

    } else if (stage === 4) {
      // Stage 4: Live Countdown Page (Countdown background.jpg)
      innerCard.classList.add('show-couple', 'show-datetime', 'show-location', 'show-countdown');
      innerCard.classList.remove('show-closing');
      resetClosingRevealSequence();

      playGoldenChimeSound();
      playCountdownRevealSequence();

    } else if (stage === 5) {
      // Stage 5: Blessing Quote & Closing Message (Countdown Background 2.jpg)
      innerCard.classList.add('show-couple', 'show-datetime', 'show-location', 'show-countdown', 'show-closing');

      playGoldenChimeSound();
      playClosingRevealSequence();
    }
  }

  // =========================================================================
  // SILKY SMOOTH SLIDE-LOCKED GESTURE NAVIGATION (1 Scroll/Swipe = 1 Slide)
  // Perfectly balanced: Responds immediately on the 1st scroll, zero multi-slide skipping
  // =========================================================================
  let isStageTransitioning = false;
  let stageLockTimer = null;

  function lockTransition(ms = 700) {
    isStageTransitioning = true;
    clearTimeout(stageLockTimer);
    stageLockTimer = setTimeout(() => {
      isStageTransitioning = false;
    }, ms);
  }

  function goToNextStage() {
    if (!isOpen || isStageTransitioning) return;
    if (currentStage < 5) {
      lockTransition(700);
      setStage(currentStage + 1);
    }
  }

  function goToPrevStage() {
    if (!isOpen || isStageTransitioning) return;
    if (currentStage > 0) {
      lockTransition(700);
      setStage(currentStage - 1);
    }
  }

  function initScrollBehavior() {
    let wheelDeltaAccumulator = 0;
    let wheelResetTimer = null;

    // 1. Desktop Mouse Wheel & Trackpad (Instant 1st scroll response + inertia protection)
    window.addEventListener('wheel', (e) => {
      if (!isOpen) return;

      if (isStageTransitioning) {
        wheelDeltaAccumulator = 0;
        return;
      }

      wheelDeltaAccumulator += e.deltaY;

      const WHEEL_THRESHOLD = 25; // Triggers instantly on the very first scroll notch
      if (wheelDeltaAccumulator >= WHEEL_THRESHOLD) {
        wheelDeltaAccumulator = 0;
        goToNextStage();
      } else if (wheelDeltaAccumulator <= -WHEEL_THRESHOLD) {
        wheelDeltaAccumulator = 0;
        goToPrevStage();
      }

      clearTimeout(wheelResetTimer);
      wheelResetTimer = setTimeout(() => {
        wheelDeltaAccumulator = 0;
      }, 150);
    }, { passive: true });

    // 2. Mobile & Tablet Touch Swipes (Smooth 1-swipe = 1-slide)
    let touchStartY = 0;
    let touchStartX = 0;
    let isTouchActive = false;

    window.addEventListener('touchstart', (e) => {
      if (!isOpen || e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isTouchActive = true;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isOpen || !isTouchActive) return;
      const diffY = touchStartY - e.touches[0].clientY;
      const diffX = touchStartX - e.touches[0].clientX;
      if (Math.abs(diffY) > Math.abs(diffX) && e.cancelable) {
        e.preventDefault();
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      if (!isOpen || !isTouchActive) return;
      isTouchActive = false;
      if (isStageTransitioning) return;
      if (!e.changedTouches || e.changedTouches.length === 0) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaX = touchStartX - e.changedTouches[0].clientX;

      // Vertical swipe with threshold of 35px
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 35) {
        if (deltaY > 0) {
          // Swiped up -> Advance to next slide
          goToNextStage();
        } else {
          // Swiped down -> Previous slide
          goToPrevStage();
        }
      }
    }, { passive: true });

    // 3. Prompt Badge Click
    if (scrollPrompt) {
      scrollPrompt.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isOpen) return;
        if (currentStage === 5) {
          resetEnvelope();
        } else {
          goToNextStage();
        }
      });

      scrollPrompt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollPrompt.click();
        }
      });
    }

    // 4. Keyboard Navigation (Down / Up / Space / PageDown / PageUp)
    window.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        if (currentStage === 5) {
          resetEnvelope();
        } else {
          goToNextStage();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrevStage();
      }
    });
  }

  // =========================================================================
  // ANIMATION ENGINE: Word-by-Word Sequence & Envelope Controls
  // =========================================================================
  function openEnvelope() {
    if (isOpen || isAnimating) return;
    isAnimating = true;
    initAudioContext();

    playWaxBreakSound();
    playPaperUnfoldSound();
    playGoldenChimeSound();

    // Immediately disable door pointer events so they never block the card
    doorLeft.style.pointerEvents = 'none';
    doorRight.style.pointerEvents = 'none';
    waxSealWrapper.style.pointerEvents = 'none';

    // Start cleanly at Stage 0
    innerCard.classList.remove('show-couple', 'show-datetime', 'show-location', 'show-countdown');
    currentStage = 0;
    if (scrollTrack) scrollTrack.scrollTop = 0;
    updateNavUI(0);

    // Reset letters initial state
    const letters = coupleNamesWrap ? coupleNamesWrap.querySelectorAll('.letter') : [];
    letters.forEach((l) => {
      l.style.opacity = '0';
      l.style.transform = 'translateY(12px) scale(0.92)';
    });

    const allWords = layerAnnouncement ? layerAnnouncement.querySelectorAll('.word') : [];
    const line1Words = layerAnnouncement ? layerAnnouncement.querySelectorAll('#line1 .word') : [];
    const line2Words = layerAnnouncement ? layerAnnouncement.querySelectorAll('#line2 .word') : [];
    const titleWords = layerAnnouncement ? layerAnnouncement.querySelectorAll('#ceremonyTitle .word') : [];
    const ofWord = layerAnnouncement ? layerAnnouncement.querySelectorAll('#line3 .word') : [];

    if (window.gsap) {
      const tl = gsap.timeline({
        onComplete: () => {
          isOpen = true;
          isAnimating = false;
        }
      });

      // 1. Fade hint & seam
      tl.to(tapHint, { opacity: 0, y: 6, duration: 0.18, ease: 'power2.in' }, 0);
      tl.to(centerSeam, { opacity: 0, duration: 0.22 }, 0);

      // 2. Wax Seal pop & fly off
      tl.to(waxSealWrapper, { scale: 1.18, rotation: 8, duration: 0.28, ease: 'back.out(2)' }, 0);
      tl.to(waxSealWrapper, { scale: 1.4, opacity: 0, y: -20, duration: 0.4, ease: 'power3.in' }, 0.2);

      // 3. Doors swing open in 3D gatefold motion with cinematic ease
      tl.to(doorLeft, { rotationY: -125, duration: 1.5, ease: 'power3.inOut' }, 0.16);
      tl.to(doorRight, { rotationY: 125, duration: 1.5, ease: 'power3.inOut' }, 0.16);

      // Flaps gently tuck away
      tl.to([doorLeft, doorRight], { opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.85);

      // Mark is-open once doors are open and seal has flown away
      tl.add(() => {
        envelopeWrapper.classList.add('is-open');
      }, 1.5);

      // 4. Inner card smoothly comes forward
      tl.fromTo(innerCard, { scale: 0.96 }, { scale: 1.0, duration: 1.2, ease: 'power2.out' }, 0.25);

      // Floating controls appear
      tl.add(() => {
        floatingControls.classList.add('is-visible');
      }, 1.2);

      // 5. SLOW, LUXURIOUS & SMOOTH GREETING REVEAL
      // Line 1: "With great pleasure and heartfelt joy,"
      if (line1Words.length > 0) {
        tl.to(line1Words, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.16,
          ease: 'sine.out'
        }, 0.95);
      }

      // Line 2: "we invite you to join us for the"
      if (line2Words.length > 0) {
        tl.to(line2Words, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.15,
          ease: 'sine.out'
        }, 1.95);
      }

      // Grand Title: "Engagement Ceremony" blooms with gold radiance
      if (titleWords.length > 0) {
        tl.fromTo(titleWords,
          { opacity: 0, y: 16, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.15,
            stagger: 0.32,
            ease: 'power2.out'
          },
          3.25
        );
      }

      // Line 3: "of"
      if (ofWord.length > 0) {
        tl.to(ofWord, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'sine.out'
        }, 4.05);
      }

      // Prompt Badge softly appears once the greeting has bloomed
      tl.add(() => {
        isOpen = true;
        if (scrollPrompt) scrollPrompt.classList.add('is-visible');
      }, 4.15);

    } else {
      // Fallback without GSAP
      tapHint.style.opacity = '0';
      waxSealWrapper.style.transform = 'translate(-50%, -50%) scale(1.3)';
      waxSealWrapper.style.opacity = '0';

      doorLeft.style.transition = 'transform 1.4s cubic-bezier(0.25, 1, 0.35, 1)';
      doorRight.style.transition = 'transform 1.4s cubic-bezier(0.25, 1, 0.35, 1)';
      doorLeft.style.transform = 'rotateY(-125deg)';
      doorRight.style.transform = 'rotateY(125deg)';

      if (allWords) {
        allWords.forEach((w, idx) => {
          setTimeout(() => {
            w.style.opacity = '1';
            w.style.transform = 'translateY(0)';
          }, 950 + idx * 180);
        });
      }

      setTimeout(() => {
        isOpen = true;
        isAnimating = false;
        floatingControls.classList.add('is-visible');
        if (scrollPrompt) scrollPrompt.classList.add('is-visible');
        if (scrollTrack) scrollTrack.scrollTop = 0;
      }, 4200);
    }
  }

  function resetEnvelope() {
    if (!isOpen || isAnimating) return;
    isAnimating = true;
    initAudioContext();
    playPaperUnfoldSound();

    floatingControls.classList.remove('is-visible');
    if (scrollPrompt) scrollPrompt.classList.remove('is-visible');
    if (scrollTrack) scrollTrack.scrollTop = 0;

    // Reset crossfade to announcement
    innerCard.classList.remove('show-couple', 'show-datetime', 'show-location', 'show-countdown', 'show-closing');
    currentStage = 0;
    counterRolled = false;
    resetDateRevealSequence();
    resetLocationRevealSequence();
    resetCountdownRevealSequence();
    resetClosingRevealSequence();
    updateNavUI(0);

    const allWords = layerAnnouncement ? layerAnnouncement.querySelectorAll('.word') : [];
    const letters = coupleNamesWrap ? coupleNamesWrap.querySelectorAll('.letter') : [];

    doorLeft.style.visibility = 'visible';
    doorRight.style.visibility = 'visible';
    waxSealWrapper.style.display = 'flex';
    centerSeam.style.display = 'block';

    if (window.gsap) {
      const tl = gsap.timeline({
        onComplete: () => {
          isOpen = false;
          isAnimating = false;
          envelopeWrapper.classList.remove('is-open');
          waxSealWrapper.style.pointerEvents = 'auto';
          doorLeft.style.pointerEvents = 'auto';
          doorRight.style.pointerEvents = 'auto';
        }
      });

      // Reset words & letters
      if (allWords && allWords.length > 0) {
        tl.to(allWords, { opacity: 0, y: 8, duration: 0.25, ease: 'power2.in' }, 0);
      }
      if (letters && letters.length > 0) {
        tl.to(letters, { opacity: 0, y: 12, scale: 0.92, duration: 0.25, ease: 'power2.in' }, 0);
      }

      // Swing doors closed
      tl.to([doorLeft, doorRight], { opacity: 1, rotationY: 0, duration: 1.1, ease: 'power3.inOut' }, 0.08);
      tl.to(innerCard, { scale: 0.96, duration: 0.9, ease: 'power2.inOut' }, 0.08);
      tl.to(centerSeam, { opacity: 1, duration: 0.35 }, 0.7);
      tl.to(waxSealWrapper, { scale: 1, rotation: 0, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)' }, 0.7);
      tl.to(tapHint, { opacity: 1, y: 0, duration: 0.35 }, 0.95);

    } else {
      if (allWords) {
        allWords.forEach((w) => {
          w.style.opacity = '0';
          w.style.transform = 'translateY(8px)';
        });
      }
      if (letters) {
        letters.forEach((l) => {
          l.style.opacity = '0';
          l.style.transform = 'translateY(12px) scale(0.92)';
        });
      }
      doorLeft.style.transform = 'rotateY(0deg)';
      doorRight.style.transform = 'rotateY(0deg)';
      doorLeft.style.opacity = '1';
      doorRight.style.opacity = '1';
      setTimeout(() => {
        waxSealWrapper.style.opacity = '1';
        waxSealWrapper.style.transform = 'translate(-50%, -50%) scale(1)';
        waxSealWrapper.style.pointerEvents = 'auto';
        doorLeft.style.pointerEvents = 'auto';
        doorRight.style.pointerEvents = 'auto';
        tapHint.style.opacity = '1';
        envelopeWrapper.classList.remove('is-open');
        isOpen = false;
        isAnimating = false;
      }, 1100);
    }
  }

  // =========================================================================
  // EVENT LISTENERS
  // =========================================================================
  waxSealWrapper.addEventListener('click', openEnvelope);
  waxSealWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

  doorLeft.addEventListener('click', () => { if (!isOpen) openEnvelope(); });
  doorRight.addEventListener('click', () => { if (!isOpen) openEnvelope(); });
  replayBtn.addEventListener('click', resetEnvelope);
  if (btnCloseEnvelope) {
    btnCloseEnvelope.addEventListener('click', resetEnvelope);
  }

  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundIconOn.classList.remove('hidden');
      soundIconOff.classList.add('hidden');
      initAudioContext();
    } else {
      soundIconOn.classList.add('hidden');
      soundIconOff.classList.remove('hidden');
    }
  });

  // =========================================================================
  // AMBIENT GOLD DUST PARTICLES
  // =========================================================================
  function initParticles() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = width < 500 ? 30 : 50;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        speedY: -(Math.random() * 0.3 + 0.1),
        speedX: (Math.random() - 0.5) * 0.15,
        pulse: Math.random() * Math.PI,
        pulseSpeed: Math.random() * 0.02 + 0.01
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.pulse += p.pulseSpeed;
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 189, 88, ${currentAlpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(render);
    }

    render();
  }

  // Initialize
  window.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollBehavior();
  });

})();
