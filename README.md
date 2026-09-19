# FríoTrack — Landing Page

Landing page de **FríoTrack** (equipo BlackStartup, curso 1ASI0730 Aplicaciones Web, UPC): monitoreo de la cadena de frío en el transporte terrestre de alimentos perecibles en el Perú.

HTML, CSS y JavaScript puros, sin dependencias ni compilación. Implementa el diseño descrito en el Capítulo IV del informe (secciones 4.1 a 4.3): los colores, la tipografía (Inter) y el logotipo siguen la guía de estilo del informe.

## Estructura

```
friotrack-landing/
├── index.html                 # Landing principal
├── Terms-and-Condition.html   # Términos y condiciones (ES/EN)
├── assets/
│   ├── css/styles.css         # Tokens de diseño y componentes
│   ├── js/i18n.js             # Motor ES/EN (data-i18n)
│   ├── js/hero-sim.js         # Simulación del panel con alerta de temperatura
│   ├── js/app.js              # Menú, modal, pestañas, corredores, planes, contacto
│   └── images/                # logo.svg, og-friotrack.png y team/ (fotos del equipo)
└── i18n/
    ├── es.js                  # Textos en español
    └── en.js                  # Textos en inglés
```

## Uso local

Abre `index.html` con doble clic, o levanta un servidor:

```bash
python -m http.server 8000
```

## Publicación en GitHub Pages

En **Settings → Pages**, elige la rama `main` y la carpeta raíz. La dirección esperada es `https://upc-pre-202620-1asi0730-8088-friotrack.github.io/friotrack-landing/`. La imagen de vista previa (`og:image`) usa esa dirección absoluta; si el sitio se publica en otra, actualízala en `index.html`.

## Flujo de trabajo con Git (GitFlow)

- `main`: versión publicada.
- `develop`: integración. Toda funcionalidad llega aquí mediante un *pull request*.
- `feature/*`: una rama por funcionalidad (por ejemplo `feature/hero` o `feature/i18n`).

Los mensajes de *commit* siguen Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`).

## Qué editar

- **Fotos del equipo:** copia los PNG en `assets/images/team/` (ver `README.txt` de esa carpeta). Sin foto, se muestran las iniciales.
- **Precios referenciales:** constante `PLANS` al inicio de `assets/js/app.js`.
- **Formulario de contacto:** define `CONTACT_ENDPOINT` en `app.js` cuando exista un servicio que reciba los datos. Mientras sea `null`, el formulario solo confirma en pantalla y avisa que es una demostración.
- **Textos:** todo está en `i18n/es.js` y `i18n/en.js` (mismas claves en ambos).
- **Términos y condiciones:** borrador informativo; revisar con asesoría legal.

## Notas

- Los datos del panel del hero son **simulados**.
- Cifras de contexto: Banco Mundial (2023), FAO (2022), MTC (2023), las mismas fuentes del Capítulo I del informe.
- El idioma inicial sigue al del navegador (español o inglés) y se recuerda con `localStorage`.
- Accesibilidad: atributos ARIA, foco visible, navegación por teclado, contraste según WCAG 2.2 AA (bordes de campos incluidos) y `prefers-reduced-motion`.
