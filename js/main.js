/* =========================================
   SALÓN CARMÍN — JAVASCRIPT PRINCIPAL
   • Navbar dinámico
   • Reveal on scroll
   • WhatsApp integration (NÚCLEO DEL NEGOCIO)
   • Menú hamburguesa
   • Pre-fill paquetes → formulario
   ========================================= */

'use strict';

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

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    // Evitar scroll del body cuando el menú está abierto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar al hacer click en cualquier link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* =========================================
   3. REVEAL ON SCROLL (Intersection Observer)
   ========================================= */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

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
  if (window.matchMedia('(min-width: 769px)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        bg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
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
    btn.addEventListener('click', (e) => {
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Validar
    if (!validateForm(form)) return;

    // 2. Recolectar datos
    const data = recolectarDatos(form);

    // 3. Construir mensaje
    const mensaje = construirMensaje(data);

    // 4. Redirigir a WhatsApp
    enviarAWhatsApp(mensaje);
  });
}

// ── VALIDACIÓN ────────────────────────────
function validateForm(form) {
  const requeridos = form.querySelectorAll('[required]');
  let valido = true;

  // Limpiar errores previos
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.error-msg').forEach(el => el.remove());

  requeridos.forEach(campo => {
    const valor = campo.value.trim();
    let error   = '';

    if (!valor) {
      error = 'Este campo es obligatorio';
    } else if (campo.type === 'tel' && !validarTelefono(valor)) {
      error = 'Ingresa un número de teléfono válido';
    } else if (campo.type === 'date') {
      const fecha    = new Date(valor);
      const hoy      = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fecha < hoy) error = 'La fecha debe ser en el futuro';
    }

    if (error) {
      valido = false;
      campo.classList.add('error');
      const msg = document.createElement('span');
      msg.className    = 'error-msg';
      msg.textContent  = error;
      msg.style.cssText = 'color:#e05252;font-size:0.72rem;margin-top:0.25rem;display:block;';
      campo.parentElement.appendChild(msg);
    }
  });

  // Scroll al primer error
  if (!valido) {
    const primerError = form.querySelector('.error');
    if (primerError) {
      primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      primerError.focus();
    }
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
function enviarAWhatsApp(mensaje) {
  const mensajeCodificado = encodeURIComponent(mensaje);
  const url               = `https://wa.me/${CONFIG.WA_NUMBER}?text=${mensajeCodificado}`;

  // Feedback visual al usuario
  mostrarConfirmacion(() => {
    // Abrir WhatsApp en nueva pestaña
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

// ── CONFIRMACIÓN VISUAL ───────────────────
function mostrarConfirmacion(callback) {
  const btn = document.querySelector('.btn-submit');
  if (!btn) { callback(); return; }

  const textoOriginal = btn.innerHTML;

  btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    ¡Abriendo WhatsApp…
  `;
  btn.disabled = true;
  btn.style.background = '#25D366';

  setTimeout(() => {
    callback(); // Abrir WhatsApp
    // Restaurar botón después de 3s
    setTimeout(() => {
      btn.innerHTML = textoOriginal;
      btn.disabled  = false;
      btn.style.background = '';
    }, 3000);
  }, 600);
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
    const top          = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* =========================================
   8. ACTIVE NAV LINK (highlight según sección)
   ========================================= */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--dorado)';
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

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const bgUrl = el.getAttribute('data-bg');
        if (bgUrl) {
          el.style.backgroundImage = bgUrl;
          el.removeAttribute('data-bg');
        }
        obs.unobserve(el);
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
  
  // Lightbox elements
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCat = document.getElementById('lightbox-cat');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  let activeCategory = 'todos';

  // 1. Filtering logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');

      const filterValue = btn.dataset.filtro;
      activeCategory = filterValue;

      // Filter grid items
      items.forEach(item => {
        const isMatch = filterValue === 'todos' || item.dataset.category === filterValue;
        if (isMatch) {
          if (item.classList.contains('filtered-out')) {
            item.style.display = 'inline-block';
            // Force reflow
            item.offsetHeight;
            item.classList.remove('filtered-out');
          }
        } else {
          item.classList.add('filtered-out');
          // Hide after transition ends (300ms)
          setTimeout(() => {
            if (item.classList.contains('filtered-out')) {
              item.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });

  // Helper to get only visible items (matching active filter)
  const getVisibleItems = () => {
    return Array.from(items).filter(item => {
      return activeCategory === 'todos' || item.dataset.category === activeCategory;
    });
  };

  // 2. Lightbox logic
  const openLightbox = (index) => {
    const visibleItems = getVisibleItems();
    if (visibleItems.length === 0) return;

    // Handle bounds
    if (index < 0) {
      index = visibleItems.length - 1;
    } else if (index >= visibleItems.length) {
      index = 0;
    }

    currentIndex = index;
    const wrapper = visibleItems[index];
    const img = wrapper.querySelector('.galeria-img');
    const cat = wrapper.querySelector('.galeria-cat').textContent;
    const desc = img.getAttribute('data-desc') || img.getAttribute('alt');

    // Populate and open
    lightboxImg.src = img.src;
    lightboxCat.textContent = cat;
    lightboxDesc.textContent = desc;

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Click on gallery card
  items.forEach(item => {
    const card = item.querySelector('.galeria-card');
    card.addEventListener('click', () => {
      const visibleItems = getVisibleItems();
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) {
        openLightbox(idx);
      }
    });
  });

  // Lightbox control events
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => openLightbox(currentIndex - 1));
  nextBtn.addEventListener('click', () => openLightbox(currentIndex + 1));

  // Close by clicking overlay background
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      openLightbox(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      openLightbox(currentIndex + 1);
    }
  });
}
