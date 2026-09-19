/* FríoTrack — simulación del panel (hero).
   Muestra una unidad refrigerada con lecturas de temperatura y humedad.
   El botón "Simular falla" sube la temperatura fuera del rango seguro y dispara una alerta,
   igual que lo haría la plataforma real. Todos los datos son simulados. */
(function () {
  'use strict';

  var root = document.getElementById('sim');
  if (!root || !window.FT) return;

  var NS = 'http://www.w3.org/2000/svg';
  var MIN = 0, MAX = 4;             // rango seguro en °C
  var YMIN = -2, YMAX = 9;          // escala del gráfico
  var N = 44;                       // lecturas visibles
  var W = 600, H = 250, PL = 34, PR = 14, PT = 14, PB = 10;
  var NORMAL = 2.0, FAIL = 7.8;     // temperatura objetivo normal / con falla
  var TICK_MS = 900;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var elTemp = document.getElementById('simTemp');
  var elHum = document.getElementById('simHum');
  var elStatus = document.getElementById('simStatus');
  var elChart = document.getElementById('simChart');
  var elAlert = document.getElementById('simAlert');
  var elToggle = document.getElementById('simToggle');

  var temp = NORMAL, hum = 91, failing = false;
  var alertKind = 'idle';           // idle | alert | recovered
  var alertInfo = null;
  var data = [];
  var timer = null;
  var svgParts = {};

  for (var i = 0; i < N; i++) {
    data.push(NORMAL + 0.28 * Math.sin(i * 0.9) + 0.12 * Math.cos(i * 2.1));
  }

  function sx(i) { return PL + i * (W - PL - PR) / (N - 1); }
  function sy(v) { return PT + (YMAX - v) * (H - PT - PB) / (YMAX - YMIN); }
  function svgEl(name, attrs) {
    var e = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  function buildChart() {
    var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img' });

    var defs = svgEl('defs');
    var clipIn = svgEl('clipPath', { id: 'ftClipIn' });
    clipIn.appendChild(svgEl('rect', { x: 0, y: sy(MAX), width: W, height: sy(MIN) - sy(MAX) }));
    var clipOut = svgEl('clipPath', { id: 'ftClipOut' });
    clipOut.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: sy(MAX) }));
    clipOut.appendChild(svgEl('rect', { x: 0, y: sy(MIN), width: W, height: H - sy(MIN) }));
    defs.appendChild(clipIn);
    defs.appendChild(clipOut);
    svg.appendChild(defs);

    svg.appendChild(svgEl('rect', { class: 'band', x: PL, y: sy(MAX), width: W - PL - PR, height: sy(MIN) - sy(MAX), rx: 4 }));

    [0, 2, 4, 6, 8].forEach(function (v) {
      svg.appendChild(svgEl('line', { class: 'grid', x1: PL, x2: W - PR, y1: sy(v), y2: sy(v) }));
      var tx = svgEl('text', { class: 'tick', x: PL - 8, y: sy(v) + 4, 'text-anchor': 'end' });
      tx.textContent = v + '°';
      svg.appendChild(tx);
    });

    svgParts.bandLabel = svgEl('text', { class: 'band-label', x: PL + 10, y: sy(MAX) + 17 });
    svg.appendChild(svgParts.bandLabel);

    svgParts.lineIn = svgEl('path', { class: 'line line-in', 'clip-path': 'url(#ftClipIn)' });
    svgParts.lineOut = svgEl('path', { class: 'line line-out', 'clip-path': 'url(#ftClipOut)' });
    svgParts.head = svgEl('circle', { class: 'head', r: 6 });
    svg.appendChild(svgParts.lineIn);
    svg.appendChild(svgParts.lineOut);
    svg.appendChild(svgParts.head);

    svgParts.svg = svg;
    elChart.appendChild(svg);
  }

  function pathD() {
    return data.map(function (v, i) {
      return (i ? 'L' : 'M') + sx(i).toFixed(1) + ',' + sy(v).toFixed(1);
    }).join(' ');
  }

  function renderStatic() {
    svgParts.svg.setAttribute('aria-label', FT.t('sim_chart'));
    svgParts.bandLabel.textContent = FT.t('sim_band', { min: MIN, max: MAX });
    elToggle.textContent = failing ? FT.t('sim_btn_fix') : FT.t('sim_btn_fail');
  }

  function renderReadouts() {
    var bad = temp > MAX || temp < MIN;
    root.setAttribute('data-state', bad ? 'bad' : 'ok');
    elTemp.textContent = FT.num(temp, 1) + ' °C';
    elHum.textContent = FT.num(hum, 0) + (FT.lang === 'es' ? ' %' : '%');
    elStatus.innerHTML =
      '<span class="status-pill"><svg class="icon" aria-hidden="true"><use href="#' + (bad ? 'i-bell' : 'i-check') + '"/></svg>' +
      FT.t(bad ? 'sim_status_bad' : 'sim_status_ok') + '</span>';
  }

  function renderChart() {
    var d = pathD();
    svgParts.lineIn.setAttribute('d', d);
    svgParts.lineOut.setAttribute('d', d);
    svgParts.head.setAttribute('cx', sx(N - 1));
    svgParts.head.setAttribute('cy', sy(data[N - 1]));
  }

  function renderAlert(animate) {
    elAlert.className = 'sim-alert';
    if (alertKind === 'alert') {
      elAlert.classList.add('is-alert');
      elAlert.innerHTML =
        '<div class="alert-body"><strong><svg class="icon" aria-hidden="true"><use href="#i-bell"/></svg>' + FT.t('sim_alert_title') + '</strong>' +
        '<span>' + FT.t('sim_alert_msg', { time: alertInfo.time, t: FT.num(alertInfo.t, 1), max: MAX }) + '</span>' +
        '<span>' + FT.t('sim_alert_notify') + '</span></div>';
    } else if (alertKind === 'recovered') {
      elAlert.classList.add('is-ok');
      elAlert.innerHTML =
        '<div class="alert-body"><strong><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>' + FT.t('sim_recovered_title') + '</strong>' +
        '<span>' + FT.t('sim_recovered_msg') + '</span></div>';
    } else {
      elAlert.textContent = FT.t('sim_hint');
    }
    if (animate && !reduceMotion) {
      // reinicia la animación de entrada solo cuando cambia el estado
      void elAlert.offsetWidth;
      elAlert.classList.add('enter');
    }
  }

  function tick() {
    var target = failing ? FAIL : NORMAL;
    temp += (target - temp) * (failing ? 0.14 : 0.22) + (Math.random() - 0.5) * 0.22;
    hum += ((failing ? 86 : 91) - hum) * 0.1 + (Math.random() - 0.5) * 0.6;
    data.push(temp);
    if (data.length > N) data.shift();

    if (temp > MAX && alertKind !== 'alert') {
      alertKind = 'alert';
      alertInfo = {
        time: new Date().toLocaleTimeString(FT.locale, { hour: '2-digit', minute: '2-digit' }),
        t: temp
      };
      renderAlert(true);
    } else if (!failing && alertKind === 'alert' && temp <= MAX) {
      alertKind = 'recovered';
      renderAlert(true);
    }
    renderReadouts();
    renderChart();
  }

  function start() {
    if (reduceMotion || timer || document.hidden) return;
    timer = setInterval(tick, TICK_MS);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  elToggle.addEventListener('click', function () {
    failing = !failing;
    renderStatic();
    if (reduceMotion) {
      // sin animación continua: avanza varias lecturas de una vez
      for (var k = 0; k < 18; k++) tick();
    }
  });

  document.addEventListener('ft:lang', function () {
    renderStatic();
    renderReadouts();
    renderAlert(false);
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) start(); else stop();
    }, { threshold: 0.15 }).observe(root);
  } else {
    start();
  }

  buildChart();
  renderStatic();
  renderReadouts();
  renderChart();
  renderAlert(false);
})();
