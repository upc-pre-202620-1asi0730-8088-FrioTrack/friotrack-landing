/* FríoTrack — interactividad de la landing page.
   Requiere assets/js/i18n.js (window.FT) cargado antes. */
(function () {
  'use strict';

  /* ---------- Configuración editable ---------- */
  // Precios referenciales en soles (PEN). Anual = 10 meses (2 meses gratis).
  var PLANS = { basic: 79, pro: 199 };
  // Cuando exista un backend, coloca aquí la URL a la que se enviará el formulario de contacto.
  var CONTACT_ENDPOINT = null;
  // Regla de contraseña del registro (8+ caracteres, mayúscula, minúscula y número).
  var PWD_PATTERN = '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}';

  var FT = window.FT;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 1. Menú móvil ---------- */
  var burger = $('hamburgerBtn');
  var menu = $('mobileMenu');

  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', FT.t(open ? 'menu_close' : 'menu_open'));
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.querySelectorAll('nav a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('ft:lang', function () {
    burger.setAttribute('aria-label', FT.t(menu.classList.contains('open') ? 'menu_close' : 'menu_open'));
  });

  /* ---------- 2. Modal de acceso / registro ---------- */
  var modal = $('authModal');
  var authForm = $('authForm');
  var authTitle = $('modalTitle');
  var authSubmit = $('authSubmitBtn');
  var phoneGroup = $('phoneGroup');
  var authPhone = $('authPhone');
  var authPassword = $('authPassword');
  var authTerms = $('authTerms');
  var pwdHint = $('authPwdHint');
  var authMsg = $('authMsg');
  var switchText = $('authSwitchText');
  var switchLink = $('authSwitchLink');
  var isLogin = true;
  var lastFocus = null;

  function renderAuth() {
    authTitle.setAttribute('data-i18n', isLogin ? 'auth_login_title' : 'auth_register_title');
    authSubmit.setAttribute('data-i18n', isLogin ? 'auth_login_btn' : 'auth_register_btn');
    switchText.setAttribute('data-i18n', isLogin ? 'auth_no_account' : 'auth_has_account');
    switchLink.setAttribute('data-i18n', isLogin ? 'auth_register_link' : 'auth_login_link');
    authTitle.textContent = FT.t(authTitle.getAttribute('data-i18n'));
    authSubmit.textContent = FT.t(authSubmit.getAttribute('data-i18n'));
    switchText.textContent = FT.t(switchText.getAttribute('data-i18n'));
    switchLink.textContent = FT.t(switchLink.getAttribute('data-i18n'));
    phoneGroup.hidden = isLogin;
    authTerms.hidden = isLogin;
    authPhone.required = !isLogin;
    authPassword.setAttribute('autocomplete', isLogin ? 'current-password' : 'new-password');
    // La regla de seguridad solo se exige al crear la cuenta, no al iniciar sesión.
    if (isLogin) authPassword.removeAttribute('pattern'); else authPassword.setAttribute('pattern', PWD_PATTERN);
    authPassword.setAttribute('data-i18n-placeholder', isLogin ? 'auth_password_ph_login' : 'auth_password_ph');
    authPassword.setAttribute('placeholder', FT.t(isLogin ? 'auth_password_ph_login' : 'auth_password_ph'));
    pwdHint.hidden = isLogin;
    authMsg.hidden = true;
  }

  function openModal(mode) {
    isLogin = mode === 'login';
    lastFocus = document.activeElement;
    setMenu(false);
    renderAuth();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('authEmail').focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    authForm.reset();
    authMsg.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $('btnLogin').addEventListener('click', function () { openModal('login'); });
  $('btnRegister').addEventListener('click', function () { openModal('register'); });
  document.querySelectorAll('.action-register').forEach(function (b) {
    b.addEventListener('click', function () { openModal('register'); });
  });
  $('closeModal').addEventListener('click', closeModal);
  modal.addEventListener('mousedown', function (e) { if (e.target === modal) closeModal(); });
  switchLink.addEventListener('click', function (e) {
    e.preventDefault();
    isLogin = !isLogin;
    renderAuth();
  });
  authForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!authForm.checkValidity()) { authForm.reportValidity(); return; }
    authMsg.hidden = false; // versión demostrativa: aún no hay backend
  });
  document.addEventListener('ft:lang', function () { if (!modal.hidden) renderAuth(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!modal.hidden) closeModal();
      else if (menu.classList.contains('open')) { setMenu(false); burger.focus(); }
    }
    // Trampa de foco dentro del modal
    if (e.key === 'Tab' && !modal.hidden) {
      var f = modal.querySelectorAll('button, a[href], input, select, textarea');
      var vis = Array.prototype.filter.call(f, function (n) { return n.offsetParent !== null; });
      if (!vis.length) return;
      var first = vis[0], last = vis[vis.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- 3. Teléfonos: solo dígitos y "+" inicial ---------- */
  document.querySelectorAll('input[type="tel"]').forEach(function (input) {
    input.addEventListener('input', function () {
      this.value = this.value.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
    });
  });

  /* ---------- 4. Pestañas "Para quién" ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next); next.focus(); }
    });
  });

  /* ---------- 5. Corredores ---------- */
  var routeBtns = document.querySelectorAll('.corridor-btn');
  var routePaths = document.querySelectorAll('.route');
  var nodes = document.querySelectorAll('.node');
  var dot = $('truckDot');
  var motion = $('truckMotion');
  var mpath = $('truckPath');
  var currentRoute = 'lib';

  function selectRoute(r) {
    currentRoute = r;
    routeBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.route === r)); });
    routePaths.forEach(function (p) { p.classList.toggle('active', p.id === 'route-' + r); });
    nodes.forEach(function (n) { n.classList.toggle('active', n.dataset.route === r); });
    $('corridorGoods').textContent = FT.t('c_' + r + '_goods');
    if (!reduceMotion && motion && motion.beginElement) {
      mpath.setAttribute('href', '#route-' + r);
      dot.setAttribute('opacity', '1');
      motion.beginElement();
    }
  }
  routeBtns.forEach(function (b) { b.addEventListener('click', function () { selectRoute(b.dataset.route); }); });
  nodes.forEach(function (n) { n.addEventListener('click', function () { selectRoute(n.dataset.route); }); });
  document.addEventListener('ft:lang', function () { $('corridorGoods').textContent = FT.t('c_' + currentRoute + '_goods'); });
  selectRoute(currentRoute);

  /* ---------- 6. Planes: mensual / anual ---------- */
  var annual = false;
  var bMonthly = $('billMonthly');
  var bAnnual = $('billAnnual');

  function renderPricing() {
    bMonthly.setAttribute('aria-pressed', String(!annual));
    bAnnual.setAttribute('aria-pressed', String(annual));
    Object.keys(PLANS).forEach(function (key) {
      var card = document.querySelector('.plan[data-plan="' + key + '"]');
      var amount = annual ? PLANS[key] * 10 : PLANS[key];
      card.querySelector('[data-price]').textContent = 'S/ ' + FT.num(amount, 0);
      card.querySelector('[data-price-unit]').textContent = FT.t(annual ? 'per_year' : 'per_month');
    });
  }
  bMonthly.addEventListener('click', function () { annual = false; renderPricing(); });
  bAnnual.addEventListener('click', function () { annual = true; renderPricing(); });
  document.addEventListener('ft:lang', renderPricing);
  renderPricing();

  /* ---------- 7. Formulario de contacto ---------- */
  var form = $('contactForm');
  var success = $('contactSuccess');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var payload = {};
    new FormData(form).forEach(function (v, k) { payload[k] = v; });

    var done = function () {
      $('contactSuccessMsg').textContent = FT.t('f_ok_msg', { name: payload.name.split(' ')[0] });
      $('contactDemo').hidden = !!CONTACT_ENDPOINT; // sin backend, se avisa que es una demostración
      form.hidden = true;
      success.hidden = false;
    };

    if (CONTACT_ENDPOINT) {
      fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(done).catch(done);
    } else {
      done(); // sin backend: solo confirma en pantalla
    }
  });
  $('contactAgain').addEventListener('click', function () {
    form.reset();
    form.classList.remove('was-validated');
    form.hidden = false;
    success.hidden = true;
  });
})();
