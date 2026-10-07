/* =========================================
   SALÓN CARMÍN — JAVASCRIPT PRINCIPAL
   • Navbar dinámico
   • Reveal on scroll
   • WhatsApp integration (NÚCLEO DEL NEGOCIO)
   • Menú hamburguesa
   • Pre-fill paquetes → formulario
   ========================================= */

'use strict';

// Enable motion styles only when JavaScript is active. The page remains readable without it.
document.documentElement.classList.add('js');

const scrollLockReasons = new Set();

function setScrollLock(reason, locked) {
  if (locked) scrollLockReasons.add(reason);
  else scrollLockReasons.delete(reason);
  document.body.style.overflow = scrollLockReasons.size ? 'hidden' : '';
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

// ── CONFIG ────────────────────────────────
const CONFIG = {
  // ⚠️ CAMBIAR: número real de WhatsApp (código país + número sin +)
  WA_NUMBER: '525580773545',
  // Nombre del negocio para el mensaje automático
  NEGOCIO: 'Salón Carmín',
};

// ── DOM READY ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initScrollReveal();
  initHeroBg();
  initPaqueteCTAs();
  initContactForm();
  initLazyBackgrounds();
  initGallery();
});

/* =========================================
   1. NAVBAR DINÁMICO
   ========================================= */
function initNavbar() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // check on load
}

/* =========================================
   2. MENÚ HAMBURGUESA (MOBILE)
   ========================================= */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const setOpen = (isOpen) => {
    navLinks.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    setScrollLock('menu', isOpen);
    if (isOpen) navLinks.querySelector('a')?.focus();
  };

  hamburger.addEventListener('click', () => {
    setOpen(!navLinks.classList.contains('open'));
  });

  // Cerrar al hacer click en cualquier link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setOpen(false);
      hamburger.focus();
    });
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      setOpen(false);
      hamburger.focus();
    }
  });
}

/* =========================================
   3. REVEAL ON SCROLL (Intersection Observer)
   ========================================= */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Pequeño delay escalonado para elementos hermanos
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
        const index    = siblings.indexOf(entry.target);
        const delay    = Math.min(index * 80, 400); // máx 400ms

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target); // Solo una vez
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  targets.forEach(el => observer.observe(el));
}

/* =========================================
   4. HERO BG PARALLAX SUTIL
   ========================================= */
function initHeroBg() {
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;

  // Marcar como cargado para activar la transición de escala
  bg.classList.add('loaded');

  // Parallax suave en desktop (desactivado en móvil por performance)
  if (!prefersReducedMotion() && window.matchMedia('(min-width: 769px)').matches) {
    let scheduled = false;
    window.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) bg.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
        scheduled = false;
      });
    }, { passive: true });
  }
}

/* =========================================
   5. PRE-FILL PAQUETE DESDE CARDS DE PAQUETES
   ========================================= */
function initPaqueteCTAs() {
  const btns = document.querySelectorAll('.paquete-cta');
  const selectPaquete = document.getElementById('paquete');
  if (!btns.length || !selectPaquete) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const paquete = btn.dataset.paquete;
      if (paquete) {
        selectPaquete.value = paquete;
        // Efecto visual: resaltar el select
        selectPaquete.style.borderColor = 'var(--dorado)';
        selectPaquete.style.boxShadow   = '0 0 0 3px rgba(201,168,106,0.2)';
        setTimeout(() => {
          selectPaquete.style.borderColor = '';
          selectPaquete.style.boxShadow   = '';
        }, 2000);
      }
      // Navegar al formulario ya se hace via href="#contacto"
    });
  });
}

/* =========================================
   6. FORMULARIO → WHATSAPP
   
   ESTRATEGIA:
   • Capturar todos los datos del form
   • Construir un mensaje estructurado
   • Redirigir a wa.me con el mensaje codificado
   • El coordinador recibe TODO el contexto
     sin necesidad de preguntar nada más
   ========================================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const dateField = form.querySelector('#fecha');
  const status = form.querySelector('#formStatus');

  if (dateField) dateField.min = getLocalDateISO();

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => clearFieldError(field, status));
    field.addEventListener('change', () => clearFieldError(field, status));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm(form, status)) return;

    const data = recolectarDatos(form);
    const mensaje = construirMensaje(data);
    enviarAWhatsApp(mensaje, status);
  });
}

// ── VALIDACIÓN ────────────────────────────
function getLocalDateISO() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

function clearFieldError(field, status) {
  field.classList.remove('error');
  field.removeAttribute('aria-invalid');
  field.removeAttribute('aria-describedby');
  field.parentElement.querySelector(`#${field.id}-error`)?.remove();
  if (status) status.textContent = '';
}

function validateForm(form, status) {
  const requeridos = form.querySelectorAll('[required]');
  let valido = true;

  form.querySelectorAll('.error').forEach(campo => clearFieldError(campo, status));

  requeridos.forEach(campo => {
    const valor = campo.value.trim();
    let error   = '';

    if (!valor) {
      error = 'Este campo es obligatorio';
    } else if (campo.type === 'tel' && !validarTelefono(valor)) {
      error = 'Ingresa un número de teléfono válido';
    } else if (campo.type === 'date' && valor < campo.min) {
      error = 'Elige hoy o una fecha futura';
    }

    if (error) {
      valido = false;
      campo.classList.add('error');
      campo.setAttribute('aria-invalid', 'true');
      const msg = document.createElement('span');
      msg.className = 'error-msg';
      msg.id = `${campo.id}-error`;
      msg.textContent = error;
      campo.setAttribute('aria-describedby', msg.id);
      campo.parentElement.appendChild(msg);
    }
  });

  if (!valido) {
    if (status) status.textContent = 'Revisa los campos marcados antes de continuar.';
    const primerError = form.querySelector('.error');
    if (primerError) {
      primerError.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
      primerError.focus();
    }
  } else if (status) {
    status.textContent = '';
  }

  return valido;
}

function validarTelefono(tel) {
  // Acepta: +52 55 1234 5678, 5512345678, 55 1234-5678, etc.
  const limpio = tel.replace(/[\s\-\(\)\+]/g, '');
  return /^\d{10,15}$/.test(limpio);
}

// ── RECOLECTAR DATOS ──────────────────────
function recolectarDatos(form) {
  const get = (id) => {
    const el = form.querySelector(`#${id}`);
    return el ? el.value.trim() : '';
  };

  const fechaRaw = get('fecha');
  const fechaFormateada = fechaRaw
    ? formatearFecha(fechaRaw)
    : 'No especificada';

  return {
    nombre:   get('nombre'),
    telefono: get('telefono'),
    fecha:    fechaFormateada,
    tipo:     get('tipo')     || 'No especificado',
    personas: get('personas') || 'No especificado',
    paquete:  get('paquete')  || 'No especificado',
    mensaje:  get('mensaje'),
  };
}

function formatearFecha(fechaStr) {
  // fecha viene como YYYY-MM-DD (valor del input type=date)
  const [year, month, day] = fechaStr.split('-');
  const meses = [
    'enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre'
  ];
  return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
}

// ── CONSTRUIR MENSAJE ─────────────────────
function construirMensaje(data) {
  const lineas = [
    `¡Hola, ${CONFIG.NEGOCIO}! 👋`,
    ``,
    `Me gustaría solicitar información y cotización para mi evento. Estos son mis datos:`,
    ``,
    `📋 *DATOS DEL EVENTO*`,
    `• 👤 Nombre: ${data.nombre}`,
    `• 📞 Teléfono: ${data.telefono}`,
    `• 🎉 Tipo de evento: ${data.tipo}`,
    `• 📅 Fecha deseada: ${data.fecha}`,
    `• 👥 Número de personas: ${data.personas}`,
    `• 📦 Paquete de interés: ${data.paquete}`,
  ];

  if (data.mensaje) {
    lineas.push(``, `💬 *MENSAJE ADICIONAL*`);
    lineas.push(data.mensaje);
  }

  lineas.push(``, `Quedo pendiente de su respuesta. ¡Muchas gracias! 🙏`);

  return lineas.join('\n');
}

// ── ENVIAR A WHATSAPP ─────────────────────
function enviarAWhatsApp(mensaje, status) {
  const mensajeCodificado = encodeURIComponent(mensaje);
  const url               = `https://wa.me/${CONFIG.WA_NUMBER}?text=${mensajeCodificado}`;
  if (status) status.textContent = 'Abriendo WhatsApp…';

  // Open directly from the submit gesture to avoid popup blockers.
  const newWindow = window.open(url, '_blank');
  if (newWindow) {
    newWindow.opener = null;
  } else {
    window.location.assign(url);
  }
}

/* =========================================
   7. SMOOTH SCROLL para links internos
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
});

/* =========================================
   8. ACTIVE NAV LINK (highlight según sección)
   ========================================= */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--dorado)';
            link.setAttribute('aria-current', 'location');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* =========================================
   9. LAZY LOADING BACKGROUNDS
   ========================================= */
function initLazyBackgrounds() {
  const lazyBgs = document.querySelectorAll('.lazy-bg');
  if (!lazyBgs.length) return;

  const loadBackground = (el) => {
    const bgUrl = el.getAttribute('data-bg');
    if (bgUrl) {
      el.style.backgroundImage = bgUrl;
      el.removeAttribute('data-bg');
    }
  };

  if (!('IntersectionObserver' in window)) {
    lazyBgs.forEach(loadBackground);
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadBackground(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });

  lazyBgs.forEach(el => observer.observe(el));
}

/* =========================================
   10. MASONRY GALLERY & LIGHTBOX
   ========================================= */
function initGallery() {
  const filtersContainer = document.querySelector('.galeria-filtros');
  const grid = document.querySelector('.galeria-grid');
  const lightbox = document.getElementById('lightbox');
  if (!filtersContainer || !grid || !lightbox) return;

  const filterBtns = filtersContainer.querySelectorAll('.filtro-btn');
  const items = grid.querySelectorAll('.galeria-item-wrapper');

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxSource = document.getElementById('lightbox-source');
  const lightboxCat = document.getElementById('lightbox-cat');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  if (!lightboxImg || !lightboxSource || !lightboxCat || !lightboxDesc || !closeBtn || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  let activeCategory = 'todos';
  let previousFocus = null;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.toggle('activo', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      btn.classList.add('activo');
      activeCategory = btn.dataset.filtro || 'todos';
      items.forEach(item => {
        const isMatch = activeCategory === 'todos' || item.dataset.category === activeCategory;
        item.setAttribute('aria-hidden', String(!isMatch));
        if (isMatch) {
          if (item.hidden) {
            item.hidden = false;
            item.offsetHeight;
          }
          item.classList.remove('filtered-out');
        } else {
          item.classList.add('filtered-out');
          setTimeout(() => {
            if (item.classList.contains('filtered-out')) item.hidden = true;
          }, 300);
        }
      });
    });
  });

  const getVisibleItems = () => {
    return Array.from(items).filter(item => {
      return activeCategory === 'todos' || item.dataset.category === activeCategory;
    });
  };

  const openLightbox = (index) => {
    const visibleItems = getVisibleItems();
    if (visibleItems.length === 0) return;

    index = (index + visibleItems.length) % visibleItems.length;

    currentIndex = index;
    const wrapper = visibleItems[index];
    const img = wrapper.querySelector('.galeria-img');
    const category = wrapper.querySelector('.galeria-cat')?.textContent || '';
    const description = img?.dataset.desc || img?.alt || '';
    if (!img) return;

    if (!lightbox.classList.contains('open')) previousFocus = document.activeElement;
    lightboxSource.srcset = img.dataset.fullSrc || '';
    lightboxImg.src = img.getAttribute('src') || img.currentSrc;
    lightboxImg.alt = img.alt || 'Imagen del espacio';
    lightboxCat.textContent = category;
    lightboxDesc.textContent = description;

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    setScrollLock('lightbox', true);
    closeBtn.focus();
  };

  const closeLightbox = () => {
    if (!lightbox.classList.contains('open')) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxSource.srcset = '';
    setScrollLock('lightbox', false);
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    previousFocus = null;
  };

  items.forEach(item => {
    const card = item.querySelector('.galeria-card');
    const img = item.querySelector('.galeria-img');
    if (!card || !img) return;
    card.setAttribute('aria-label', `Ampliar imagen: ${img.alt}`);
    card.addEventListener('click', () => {
      const visibleItems = getVisibleItems();
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => openLightbox(currentIndex - 1));
  nextBtn.addEventListener('click', () => openLightbox(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      openLightbox(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      openLightbox(currentIndex + 1);
    } else if (e.key === 'Tab') {
      const controls = Array.from(lightbox.querySelectorAll('button:not([disabled])'));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
