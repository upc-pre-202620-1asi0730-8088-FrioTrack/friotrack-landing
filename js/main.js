// FríoTrack Landing Page — main.js
// Handles: mobile nav toggle, i18n (EN/ES) toggle, contact form validation.

(function () {
  'use strict';

  var translations = {
    en: {
      'nav.how': 'How it works',
      'nav.segments': "Who it's for",
      'nav.pricing': 'Pricing',
      'nav.contact': 'Contact',
      'nav.cta': 'Get started',
      'hero.title': 'Know your cold chain never broke.',
      'hero.subtitle': 'FríoTrack is an affordable way for small bodegas, restaurants and pharmacies to monitor, log and get alerted about the temperature of their perishable products — no industrial hardware required.',
      'hero.ctaPrimary': 'Get started',
      'hero.ctaSecondary': 'See how it works',
      'hero.deviceTitle': 'Storage Point — Cooler A',
      'hero.deviceStatus': 'Within safe range',
      'problem.title': "A problem small businesses can't see coming",
      'problem.stat1': 'of the food Peru produces is lost due to poor cold-chain handling.',
      'problem.stat2': 'tons of food wasted every year in Peru alone (FAO / Escuela Peruana de Refrigeración).',
      'problem.stat3': 'affordable monitoring tools built for small bodegas, restaurants and pharmacies — until now.',
      'how.title': 'How FríoTrack works',
      'how.step1Title': '1. Log',
      'how.step1Text': 'Register your storage points and log temperature readings in seconds, from any device.',
      'how.step2Title': '2. Monitor',
      'how.step2Text': 'See the real-time status of every storage point in one simple dashboard.',
      'how.step3Title': '3. Get alerted',
      'how.step3Text': 'Receive an automatic alert the moment a reading leaves the safe range — before the product is lost.',
      'segments.title': 'Built for the people who live the cold chain every day',
      'segments.owner.title': 'Business owners',
      'segments.owner.text': "Bodegas, minimarkets, restaurants and pharmacies that store perishable products and want to stop losing money to spoilage they can't see coming.",
      'segments.courier.title': 'Delivery couriers',
      'segments.courier.text': 'Last-mile couriers who want a fast way to prove a product left — and arrived — in safe condition, in under a minute per delivery.',
      'pricing.title': 'Simple pricing, built for small businesses',
      'pricing.planName': 'FríoTrack Starter',
      'pricing.priceValue': 'S/ 29',
      'pricing.pricePeriod': '/ month per business',
      'pricing.f1': 'Up to 3 storage points',
      'pricing.f2': 'Unlimited temperature readings',
      'pricing.f3': 'Automatic email/WhatsApp alerts',
      'pricing.f4': 'Exportable traceability report',
      'pricing.cta': 'Get started',
      'pricing.note': 'Final pricing subject to validation with real business owners.',
      'contact.title': 'Tell us about your business',
      'contact.subtitle': 'Leave your details and our team will reach out to show you how FríoTrack can fit your business.',
      'contact.nameLabel': 'Full name',
      'contact.emailLabel': 'Email',
      'contact.businessLabel': 'Type of business',
      'contact.businessPlaceholder': 'Select one',
      'contact.businessBodega': 'Bodega / Minimarket',
      'contact.businessRestaurant': 'Restaurant',
      'contact.businessPharmacy': 'Pharmacy',
      'contact.businessCourier': 'Delivery / Courier service',
      'contact.businessOther': 'Other',
      'contact.messageLabel': 'Message (optional)',
      'contact.submit': 'Send',
      'contact.success': "Thanks! We'll be in touch shortly.",
      'footer.tagline': 'Cold-chain visibility for small businesses.',
      'footer.terms': 'Terms of Service'
    },
    es: {
      'nav.how': 'Cómo funciona',
      'nav.segments': 'Para quién es',
      'nav.pricing': 'Precios',
      'nav.contact': 'Contacto',
      'nav.cta': 'Comenzar',
      'hero.title': 'Sabe que tu cadena de frío nunca se rompió.',
      'hero.subtitle': 'FríoTrack es una forma económica para que bodegas, restaurantes y farmacias pequeñas monitoreen, registren y reciban alertas sobre la temperatura de sus productos perecederos, sin necesidad de hardware industrial.',
      'hero.ctaPrimary': 'Comenzar',
      'hero.ctaSecondary': 'Ver cómo funciona',
      'hero.deviceTitle': 'Punto de almacenamiento — Refrigeradora A',
      'hero.deviceStatus': 'Dentro del rango seguro',
      'problem.title': 'Un problema que los negocios pequeños no ven venir',
      'problem.stat1': 'de los alimentos que produce el Perú se pierde por un mal manejo de la cadena de frío.',
      'problem.stat2': 'toneladas de alimentos se desperdician cada año solo en Perú (FAO / Escuela Peruana de Refrigeración).',
      'problem.stat3': 'herramientas de monitoreo accesibles para bodegas, restaurantes y farmacias pequeñas — hasta ahora.',
      'how.title': 'Cómo funciona FríoTrack',
      'how.step1Title': '1. Registra',
      'how.step1Text': 'Registra tus puntos de almacenamiento y las lecturas de temperatura en segundos, desde cualquier dispositivo.',
      'how.step2Title': '2. Monitorea',
      'how.step2Text': 'Visualiza el estado en tiempo real de cada punto de almacenamiento en un solo panel simple.',
      'how.step3Title': '3. Recibe alertas',
      'how.step3Text': 'Recibe una alerta automática apenas una lectura sale del rango seguro, antes de que el producto se pierda.',
      'segments.title': 'Pensado para quienes viven la cadena de frío todos los días',
      'segments.owner.title': 'Dueños de negocio',
      'segments.owner.text': 'Bodegas, minimarkets, restaurantes y farmacias que almacenan productos perecederos y quieren dejar de perder dinero por daños que no ven venir.',
      'segments.courier.title': 'Repartidores',
      'segments.courier.text': 'Repartidores de última milla que quieren una forma rápida de demostrar que un producto salió — y llegó — en condiciones seguras, en menos de un minuto por entrega.',
      'pricing.title': 'Precio simple, pensado para negocios pequeños',
      'pricing.planName': 'FríoTrack Starter',
      'pricing.priceValue': 'S/ 29',
      'pricing.pricePeriod': '/ mes por negocio',
      'pricing.f1': 'Hasta 3 puntos de almacenamiento',
      'pricing.f2': 'Lecturas de temperatura ilimitadas',
      'pricing.f3': 'Alertas automáticas por correo/WhatsApp',
      'pricing.f4': 'Reporte de trazabilidad exportable',
      'pricing.cta': 'Comenzar',
      'pricing.note': 'Precio final sujeto a validación con dueños de negocio reales.',
      'contact.title': 'Cuéntanos sobre tu negocio',
      'contact.subtitle': 'Déjanos tus datos y nuestro equipo te contactará para mostrarte cómo FríoTrack puede ayudarte.',
      'contact.nameLabel': 'Nombre completo',
      'contact.emailLabel': 'Correo electrónico',
      'contact.businessLabel': 'Tipo de negocio',
      'contact.businessPlaceholder': 'Selecciona una opción',
      'contact.businessBodega': 'Bodega / Minimarket',
      'contact.businessRestaurant': 'Restaurante',
      'contact.businessPharmacy': 'Farmacia',
      'contact.businessCourier': 'Reparto / Delivery',
      'contact.businessOther': 'Otro',
      'contact.messageLabel': 'Mensaje (opcional)',
      'contact.submit': 'Enviar',
      'contact.success': '¡Gracias! Te contactaremos pronto.',
      'footer.tagline': 'Visibilidad de cadena de frío para negocios pequeños.',
      'footer.terms': 'Términos de servicio'
    }
  };

  var currentLang = 'en';

  function applyTranslations(lang) {
    var dict = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
    document.documentElement.setAttribute('lang', lang);
    var toggle = document.getElementById('langToggle');
    if (toggle) toggle.textContent = lang === 'en' ? 'ES' : 'EN';
    currentLang = lang;
  }

  function initLangToggle() {
    var toggle = document.getElementById('langToggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      applyTranslations(currentLang === 'en' ? 'es' : 'en');
    });
  }

  function initNavToggle() {
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    if (!navToggle || !navMenu) return;
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var isValid = true;

      var fullName = document.getElementById('fullName');
      var fullNameError = document.getElementById('fullNameError');
      if (!fullName.value.trim()) {
        fullNameError.textContent = currentLang === 'es' ? 'Ingresa tu nombre completo.' : 'Please enter your full name.';
        isValid = false;
      } else {
        fullNameError.textContent = '';
      }

      var email = document.getElementById('email');
      var emailError = document.getElementById('emailError');
      if (!validateEmail(email.value.trim())) {
        emailError.textContent = currentLang === 'es' ? 'Ingresa un correo electrónico válido.' : 'Please enter a valid email address.';
        isValid = false;
      } else {
        emailError.textContent = '';
      }

      var businessType = document.getElementById('businessType');
      var businessTypeError = document.getElementById('businessTypeError');
      if (!businessType.value) {
        businessTypeError.textContent = currentLang === 'es' ? 'Selecciona el tipo de negocio.' : 'Please select a business type.';
        isValid = false;
      } else {
        businessTypeError.textContent = '';
      }

      var successMessage = document.getElementById('formSuccess');
      if (isValid) {
        // Note: this is a static Landing Page (Sprint 1 scope). There is no
        // backend yet — form data is not persisted or sent anywhere.
        // Once the RESTful API exists (later sprint), replace this with a
        // fetch() call to the /api/leads endpoint.
        successMessage.hidden = false;
        form.reset();
      } else {
        successMessage.hidden = true;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyTranslations('en');
    initLangToggle();
    initNavToggle();
    initContactForm();
  });
})();
