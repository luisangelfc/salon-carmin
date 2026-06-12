# Salón Carmín — Landing Page

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

Landing page profesional para salón de eventos, construida con HTML5, CSS3 y JavaScript vanilla. Orientada a generación de leads y conversión directa vía WhatsApp.

---

## Características

- **Integración real con WhatsApp** — el formulario captura todos los datos del cliente y construye un mensaje estructurado automáticamente, enviándolo directo al número del negocio
- **Diseño premium** — paleta negro + dorado, tipografía Cormorant Garamond + Montserrat, estilo clásico elegante
- **Animaciones al hacer scroll** — reveal progresivo con IntersectionObserver, sin librerías externas
- **Navbar dinámico** — transparente en el hero, sólido al hacer scroll
- **Galería Masonry con filtros y Lightbox** — grid tipo masonry filtrable por tipo de espacio, con lightbox fullscreen, navegación por teclado y captions; reemplaza el strip infinito original
- **Capilla para ceremonias** — sección dedicada a bodas religiosas, bautizos, misas de XV años y celebraciones litúrgicas
- **Paquetes infantiles** — oferta específica para fiestas infantiles con decoración temática, área de juegos y mesa de dulces
- **100% responsive** — menú hamburguesa en móvil, layouts adaptados a cada breakpoint
- **Sin dependencias** — cero npm, cero frameworks, abre directo en el navegador

---

## Stack

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura y accesibilidad |
| CSS3 | Diseño, animaciones, variables, grid, flexbox, masonry con column-count |
| JavaScript vanilla | Interactividad, validación, galería filtrable, lightbox, integración WhatsApp |
| Google Fonts | Cormorant Garamond + Montserrat |

---

## Estructura del proyecto

```
salon-carmin/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   └── images/
│       ├── salon-principal/
│       ├── jardin/
│       ├── capilla/
│       ├── infantil/
│       └── ...
└── README.md
```

---

## Cómo funciona la integración WhatsApp

El formulario de contacto no envía emails ni necesita backend. Al hacer submit:

1. JavaScript valida todos los campos (requeridos, teléfono válido, fecha futura)
2. Recolecta: nombre, teléfono, tipo de evento, fecha, número de personas y paquete de interés
3. Construye un mensaje estructurado listo para leer
4. Redirige a `wa.me/[número]?text=[mensaje]` en una nueva pestaña
5. El cliente solo presiona "Enviar" en WhatsApp

```
¡Hola, Salón Carmín! 👋

📋 DATOS DEL EVENTO
• Nombre: [nombre]
• Teléfono: [teléfono]
• Tipo de evento: [tipo]
• Fecha deseada: [fecha]
• Número de personas: [personas]
• Paquete de interés: [paquete]

💬 MENSAJE ADICIONAL
[mensaje libre]
```

El coordinador recibe toda la información sin necesidad de preguntar nada.

Los tipos de evento disponibles en el formulario incluyen:
- Boda
- XV Años
- Graduación
- Corporativo
- **Ceremonia religiosa** *(nuevo)*
- **Fiesta infantil** *(nuevo)*

---

## Secciones de la landing

El orden no es estético — es psicológico:

| # | Sección | Objetivo |
|---|---|---|
| 1 | Hero | Impacto emocional inmediato |
| 2 | Quiénes somos | Generar confianza y legitimidad |
| 3 | Salones | Visualización: "yo celebro aquí" (incluye Capilla) |
| 4 | Tipos de eventos | Validación: "este lugar es para mí" (incluye Ceremonia religiosa y Fiesta infantil) |
| 5 | Galería | Exploración visual por espacio con filtros y lightbox |
| 6 | Paquetes | Presentar la oferta sin precios (incluye Paquete Infantil) |
| 7 | Testimonios | Prueba social antes de la acción |
| 8 | Contacto + WhatsApp | Conversión |
| 9 | Mapa | Confianza final, reducir fricción |

---

## Galería — Masonry + Filtros + Lightbox

La galería fue rediseñada para darle mayor protagonismo visual a los espacios del salón.

**Filtros disponibles:**
- Todos
- Salón Principal
- Jardín
- Capilla
- Eventos Infantiles

**Comportamiento:**
- Layout masonry con `column-count` nativo en CSS (sin Masonry.js)
- Al cambiar de filtro: transición suave con `opacity` + `scale`
- Clic en cualquier imagen abre el lightbox fullscreen
- El lightbox navega solo entre las imágenes del filtro activo
- Navegación por teclado: `ESC` cierra, `←` `→` navegan
- Clic en el fondo también cierra el lightbox

---

## Decisiones de diseño

**Sin precios visibles** — la estrategia es llevar al cliente a WhatsApp donde el coordinador puede personalizar la cotización y vender el valor antes de hablar de números. Genera más leads aunque sean menos filtrados.

**Capilla como espacio diferenciador** — se presenta tanto en la sección de Salones (espacio físico) como en Tipos de eventos (validación de uso), cubriendo dos momentos distintos del funnel de conversión.

**Paquete Infantil separado** — al tener tarjeta propia en Paquetes y tipo de evento propio en el formulario, el coordinador recibe leads infantiles ya identificados y puede cotizar sin preguntas adicionales.

**Vanilla JS** — proyecto construido sin frameworks para mantener el código comprensible, sin dependencias y como ejercicio de fundamentos.

**CSS custom properties** — toda la paleta de colores y valores recurrentes viven en variables en `:root`, facilitando cambios globales desde un solo lugar.
