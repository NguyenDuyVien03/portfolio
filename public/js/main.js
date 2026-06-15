document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavbarScroll();
  initMobileMenu();
  initCursorGlow();
  initTypewriter();
  initCounterAnimation();
  initLangSwitcher();
  initTerminal();
  initContactForm();
  initActiveNav();
});

/* ── Scroll Reveal Animations ── */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
    observer.observe(el);
  });
}

/* ── Navbar Scroll Effect ── */
function initNavbarScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    },
    { passive: true }
  );
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileNav');

  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      btn.classList.remove('active');
      nav.classList.remove('open');
    });
  });
}

/* ── Cursor Glow Effect ── */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;
    glow.style.transform = `translate(${currentX - 200}px, ${currentY - 200}px)`;
    requestAnimationFrame(animate);
  }

  animate();
}

/* ── Typewriter Effect ── */
function initTypewriter() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const titles = [
    'Backend Developer',
    'Laravel & PHP Developer',
    'REST API Architect',
    'Database Designer',
    'System Analyst',
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    if (isPaused) {
      setTimeout(type, 3000);
      isPaused = false;
      return;
    }

    const current = titles[titleIndex];

    if (!isDeleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isPaused = true;
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
      }
    }

    const speed = isDeleting ? 30 : 60;
    setTimeout(type, speed);
  }

  setTimeout(type, 1000);
}

/* ── Counter Animation ── */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-count');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'));
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

function animateCounter(el, target) {
  let current = 0;
  const increment = Math.ceil(target / 60);
  const duration = 1500;
  const stepTime = Math.floor(duration / 60);

  function update() {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = current;
    setTimeout(update, stepTime);
  }

  update();
}

/* ── Language Switcher ── */
function initLangSwitcher() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = window.__lang === 'vi' ? 'en' : 'vi';
    document.cookie = `lang=${next};path=/;max-age=31536000`;
    window.location.reload();
  });
}

/* ── Terminal ── */
function initTerminal() {
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');
  if (!input || !output) return;

  const isEn = window.__lang === 'en';

  function printCommand(cmd) {
    const line = document.createElement('div');
    line.className = 'terminal-output-line dim';
    line.textContent = `$ ${cmd}`;
    output.appendChild(line);
  }

  function printResponse(lines) {
    if (typeof lines === 'string') lines = lines.split('\n');
    lines.forEach((line) => {
      const div = document.createElement('div');
      div.className = 'terminal-output-line';

      if (line.startsWith('═══')) {
        div.className += ' cyan';
      } else if (line.match(/^[📧📞💻🔗]/)) {
        div.className += ' green';
      } else {
        div.className += ' dim';
      }

      div.textContent = line;
      output.appendChild(div);
    });
  }

  function scrollToBottom() {
    const body = document.getElementById('terminalBody');
    if (body) body.scrollTop = body.scrollHeight;
  }

  const cmds = window.__terminalCommands || [];
  const cmdHelp = cmds.map((c) => `  ${c.cmd.padEnd(11)} - ${c.description}`).join('\n');
  const notFound = isEn ? `Command not found: ` : `Không tìm thấy lệnh: `;
  const helpHint = isEn ? 'Type "help" to see available commands.' : 'Gõ "help" để xem các lệnh.';

  const commands = {
    help: () => {
      const header = isEn ? 'Available commands:' : 'Danh sách lệnh:';
      printResponse([header, '', ...cmds.map((c) => `  ${c.cmd.padEnd(11)} - ${c.description}`), '', `  clear     - ${isEn ? 'Clear terminal' : 'Xóa màn hình'}`]);
    },
    about: () => printResponse(window.__terminalResponses?.about || ['No data']),
    skills: () => printResponse(window.__terminalResponses?.skills || ['No data']),
    projects: () => printResponse(window.__terminalResponses?.projects || ['No data']),
    contact: () => printResponse(window.__terminalResponses?.contact || ['No data']),
    education: () => printResponse(window.__terminalResponses?.education || ['No data']),
    clear: () => {
      output.innerHTML = '';
    },
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      printCommand(cmd);
      input.value = '';

      if (commands[cmd]) {
        commands[cmd]();
      } else if (cmd) {
        printResponse([`${notFound}${cmd}`, helpHint]);
      }

      scrollToBottom();
    }
  });

  document.getElementById('terminal')?.addEventListener('click', () => {
    input.focus();
  });
}

/* ── Contact Form ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const alertEl = document.getElementById('contactAlert');
  const submitBtn = document.getElementById('contactSubmit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isEn = window.__lang === 'en';

    const payload = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value || 'Contact from Portfolio',
      message: form.message.value,
      lang: window.__lang,
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${isEn ? 'Sending...' : 'Đang gửi...'}`;

    try {
      const { data } = await axios.post('/api/contact', payload);
      showFormAlert(alertEl, data.message, 'success');
      form.reset();
    } catch (err) {
      const msg = err.response?.data?.message || (isEn ? 'Failed to send. Please try again.' : 'Gửi thất bại. Vui lòng thử lại.');
      showFormAlert(alertEl, msg, 'error');
    } finally {
      submitBtn.disabled = false;
      const label = isEn ? 'Send Message' : 'Gửi tin nhắn';
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${label}`;
    }
  });
}

function showFormAlert(el, message, type) {
  if (!el) return;
  el.className = `form-alert ${type}`;
  el.textContent = message;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, 5000);
}

/* ── Active Nav Link ── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link[href^="/#"]');

  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `/#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ── Expose terminal data from EJS ── */
document.addEventListener('DOMContentLoaded', () => {
  /* Terminal data is injected via EJS in the terminal partial */
});
