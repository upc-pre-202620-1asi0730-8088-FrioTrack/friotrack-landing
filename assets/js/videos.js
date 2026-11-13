/* Published videos are optional. No player or third-party request is created until requested. */
(function () {
  'use strict';

  var section = document.getElementById('videos');
  if (!section) return;
  var configuration = window.FT_CONFIG.videos || {};

  function videoId(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      var url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
      var host = url.hostname.replace(/^www\./, '');
      var id;
      if (host === 'youtu.be') id = url.pathname.slice(1);
      else if (host === 'youtube.com' && url.pathname === '/watch') id = url.searchParams.get('v');
      else if ((host === 'youtube.com' || host === 'youtube-nocookie.com') && url.pathname.indexOf('/embed/') === 0) id = url.pathname.slice(7);
      return /^[A-Za-z0-9_-]{11}$/.test(id || '') ? id : null;
    } catch (error) { return null; }
  }

  section.querySelectorAll('[data-video]').forEach(function (card) {
    var kind = card.getAttribute('data-video');
    var settings = configuration[kind] || {};
    var id = videoId(settings.youtubeUrl);
    if (!id) return;
    card.hidden = false;
    section.hidden = false;
    var player = card.querySelector('.video-player');
    var button = card.querySelector('[data-video-play]');
    var link = card.querySelector('[data-video-link]');
    link.href = 'https://www.youtube.com/watch?v=' + id;
    button.addEventListener('click', function () {
      if (player.querySelector('iframe')) return;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id;
      iframe.title = window.FT.t('videos_' + kind + '_title');
      iframe.allow = 'encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
      player.appendChild(iframe);
      button.hidden = true;
      iframe.focus();
    });
  });

  document.addEventListener('ft:lang', function () {
    section.querySelectorAll('iframe').forEach(function (iframe) {
      var kind = iframe.closest('[data-video]').getAttribute('data-video');
      iframe.title = window.FT.t('videos_' + kind + '_title');
    });
  });
})();
