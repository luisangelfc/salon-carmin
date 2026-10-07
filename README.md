# Salón Carmín

Landing page estática para presentar los espacios y servicios de Salón Carmín y facilitar que los clientes soliciten información por WhatsApp. Está construida con HTML, CSS y JavaScript sin framework ni proceso de compilación.

## Funcionalidad

- Diseño mobile-first con ajustes progresivos para tabletas y pantallas grandes.
- Navegación móvil desplegable, con cierre mediante el botón, selección de una sección o la tecla Escape.
- Secciones informativas de salones, eventos, galería, paquetes, testimonios, contacto y ubicación.
- Galería filtrable por Salón Imperial, Salón Íntimo y Capilla, con visor ampliado y navegación por teclado.
- Formulario con validación en el navegador que prepara un mensaje con los datos ingresados y abre WhatsApp. La página no tiene backend ni almacena la información.
- Imágenes WebP optimizadas, carga diferida para imágenes secundarias y animaciones que respetan la preferencia de movimiento reducido.
- Controles y navegación con soporte para teclado y atributos accesibles.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| HTML | Contenido y estructura semántica |
| CSS | Diseño adaptable, componentes, animaciones y estilos mobile-first |
| JavaScript | Menú, validación, galería, visor y enlace de WhatsApp |
| WebP / JPEG | Imágenes optimizadas y recursos originales |

La página no requiere Node.js, instalación de paquetes ni servidor de aplicación. Google Fonts y el mapa incrustado de Google Maps sí necesitan conexión a Internet.

## Estructura

```text
salon-carmin/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   └── images/
│       ├── capilla/       # Fotografías originales
│       ├── imperial/      # Fotografías originales
│       ├── intimo/        # Fotografías originales
│       ├── optimized/     # Variantes WebP para la galería
│       └── webp/          # Logo y recursos WebP del sitio
└── README.md
```

## Abrir el sitio

Abre `index.html` directamente en un navegador. Para publicarlo, sirve la carpeta como un sitio estático y conserva las rutas relativas de `assets/`, `css/` y `js/`.

## Formulario y WhatsApp

Al enviar el formulario, JavaScript valida los campos, prepara un mensaje con nombre, teléfono, fecha, tipo de evento y los detalles opcionales, y abre un enlace `wa.me` con el texto codificado. La persona debe confirmar el envío desde WhatsApp. No hay servicio de correo, base de datos ni almacenamiento en el sitio.

El número de WhatsApp usado por los enlaces y el formulario se encuentra en `index.html`; el formulario también usa la constante `CONFIG.WA_NUMBER` en `js/main.js`. Si cambia el número del negocio, actualiza ambos lugares.

## Imágenes

Las fotografías originales se conservan en sus carpetas por espacio. Las variantes WebP de `assets/images/optimized/` se usan en la galería y sus imágenes ampliadas; los recursos generales, como el logo y la imagen del hero, están en `assets/images/webp/`.

Al incorporar o reemplazar imágenes, conserva las rutas referenciadas por `index.html`, añade texto alternativo descriptivo a las imágenes informativas y mantén dimensiones explícitas para reducir cambios de diseño durante la carga.
