/* ============================================================
   PORTFOLIO SCRIPT — vanilla JavaScript, no dependencies
   Handles: sticky navbar, active section highlighting, mobile menu,
            architectural grid cursor illumination, scroll reveal,
            hero role typing effect, and the INTERACTIVE ROBOT.
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Elements ---------- */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = document.querySelectorAll('.nav-link');
  const archBg    = document.getElementById('archBg');

  /* ---------- 1. Sticky navbar shadow on scroll ---------- */
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ---------- 2. Active section tracking in navbar ---------- */
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ---------- 3. Mobile hamburger menu toggle ---------- */
  navToggle.addEventListener('click', function () {
    const open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 4. Architectural grid cursor illumination ---------- */
  if (archBg && !prefersReducedMotion) {
    window.addEventListener('mousemove', function (e) {
      archBg.style.setProperty('--spot-x', e.clientX + 'px');
      archBg.style.setProperty('--spot-y', e.clientY + 'px');
    }, { passive: true });
  }

  /* ---------- 5. Scroll reveal (fade-in) ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(function (el) { observer.observe(el); });


  /* ============================================================
     6. HERO ROLE — typewriter effect
        Edit the roles array to change the rotating job titles.
  ============================================================ */
  const roleEl = document.getElementById('roleText');
  const roles = [
    'AI-ML Undergraduate',
    'Machine Learning Enthusiast',
    'AWS Certified Solutions Architect',
    'RAG & Computer Vision Builder'
  ];

  if (roleEl) {
    if (prefersReducedMotion) {
      roleEl.textContent = roles[0];
    } else {
      let rIndex = 0, cIndex = 0, deleting = false;

      (function typeLoop() {
        const current = roles[rIndex];
        cIndex += deleting ? -1 : 1;
        roleEl.textContent = current.slice(0, cIndex);

        let delay = deleting ? 42 : 80;

        if (!deleting && cIndex === current.length) {
          delay = 1900;                 // pause on the full phrase
          deleting = true;
        } else if (deleting && cIndex === 0) {
          deleting = false;
          rIndex = (rIndex + 1) % roles.length;
          delay = 340;
        }
        setTimeout(typeLoop, delay);
      })();
    }
  }


  /* ============================================================
     7. INTERACTIVE ROBOT MASCOT
        - Pupils track the cursor, head tilts toward it
        - Random natural blinking
        - Fast excited wave on click / button press
        - Mouth morphs between moods
        - Speech bubble cycles through messages
  ============================================================ */
  const robotCard  = document.getElementById('robotInteractive');
  const wavingArm  = document.getElementById('robotWavingArm');
  const robotHead  = document.getElementById('robotHead');
  const pupilLeft  = document.getElementById('pupilLeft');
  const pupilRight = document.getElementById('pupilRight');
  const eyeLeft    = document.getElementById('eyeLeft');
  const eyeRight   = document.getElementById('eyeRight');
  const mouth      = document.getElementById('robotMouth');
  const speechText = document.getElementById('speechText');
  const waveBtn    = document.getElementById('waveBtn');
  const talkBtn    = document.getElementById('talkBtn');

  if (robotCard) {

    /* ---- Messages the robot cycles through ---- */
    const robotLines = [
      "Hi there! I'm Apoorv's AI bot.",
      'He builds with Python, Java & AWS.',
      'Into RAG, OpenCV and computer vision.',
      'Check out the eSim Tool Manager below.',
      'Ramora Realty is live — go take a look!',
      'AWS Certified Solutions Architect, Associate.',
      '1st place at Infinity Hackathon & Datathon 2K25.',
      'CGPA 9.26 at VIT-AP University.',
      'Scroll down to see the full story.',
      'Want to collaborate? Head to the contact section.'
    ];
    let lineIndex = 0;

    /* ---- Mouth shapes for different moods ---- */
    const MOUTH = {
      smile:     'M 148 132 Q 160 141 172 132',
      grin:      'M 146 130 Q 160 146 174 130',
      surprised: 'M 154 132 Q 160 144 166 132 Q 160 138 154 132'
    };

    function setMood(name, holdMs) {
      if (!mouth) return;
      mouth.setAttribute('d', MOUTH[name] || MOUTH.smile);
      if (holdMs) {
        setTimeout(function () { mouth.setAttribute('d', MOUTH.smile); }, holdMs);
      }
    }

    /* ---- Trigger an excited fast wave ---- */
    let waveTimer = null;
    function excitedWave() {
      wavingArm.classList.add('fast-wave');
      clearTimeout(waveTimer);
      waveTimer = setTimeout(function () {
        wavingArm.classList.remove('fast-wave');
      }, 2000);
    }

    /* ---- Swap speech text with a soft fade ---- */
    function say(text) {
      speechText.style.opacity = '0';
      setTimeout(function () {
        speechText.textContent = text;
        speechText.style.opacity = '1';
      }, 180);
    }

    /* ---- Advance to the next message ---- */
    function nextLine() {
      lineIndex = (lineIndex + 1) % robotLines.length;
      say(robotLines[lineIndex]);
      excitedWave();
      setMood('grin', 1400);
      blink();
    }

    /* ---- Blink by squashing the eye groups ---- */
    function blink() {
      if (!eyeLeft || !eyeRight) return;
      eyeLeft.style.transformOrigin  = '136px 110px';
      eyeRight.style.transformOrigin = '184px 110px';
      eyeLeft.style.transform  = 'scaleY(0.1)';
      eyeRight.style.transform = 'scaleY(0.1)';
      setTimeout(function () {
        eyeLeft.style.transform  = 'scaleY(1)';
        eyeRight.style.transform = 'scaleY(1)';
      }, 130);
    }

    if (!prefersReducedMotion) {
      /* Random natural blinking */
      setInterval(function () {
        if (Math.random() > 0.35) blink();
      }, 3800);

      /* Pupils track the cursor + head tilts slightly toward it */
      window.addEventListener('mousemove', function (e) {
        const rect = robotCard.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
        const max = 4.5;                        // pupil travel in SVG units
        const dx = Math.cos(angle) * max;
        const dy = Math.sin(angle) * max;

        pupilLeft.style.transform  = 'translate(' + dx + 'px,' + dy + 'px)';
        pupilRight.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';

        /* Head tilt: clamp to +/- 6 degrees */
        const tilt = Math.max(-6, Math.min(6, (e.clientX - cx) / 55));
        robotHead.style.transform = 'rotate(' + tilt + 'deg)';
      }, { passive: true });

      /* Recenter when the cursor leaves the page */
      document.addEventListener('mouseleave', function () {
        pupilLeft.style.transform  = 'translate(0,0)';
        pupilRight.style.transform = 'translate(0,0)';
        robotHead.style.transform  = 'rotate(0deg)';
      });
    }

    /* ---- Click / tap anywhere on the card ---- */
    robotCard.addEventListener('click', nextLine);

    /* ---- Keyboard accessibility (Enter / Space) ---- */
    robotCard.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        nextLine();
      }
    });

    /* ---- Robot looks surprised when you hover it ---- */
    robotCard.addEventListener('mouseenter', function () { setMood('surprised'); });
    robotCard.addEventListener('mouseleave', function () { setMood('smile'); });

    /* ---- "Wave Back" button ---- */
    waveBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      excitedWave();
      blink();
      setMood('grin', 1800);
      say('Yay! Thanks for waving back.');
    });

    /* ---- "Talk to Me" button ---- */
    talkBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      nextLine();
    });
  }

});
