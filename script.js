(function () {
  var root = document.documentElement;

  // Yıl
  var yil = document.getElementById('yil');
  if (yil) yil.textContent = new Date().getFullYear();

  // Tema: kayıtlı tercih varsa uygula, düğmeyle değiştir
  try { var kayit = localStorage.getItem('tema'); if (kayit) root.dataset.theme = kayit; } catch (e) {}
  var tema = document.getElementById('tema');
  if (tema) tema.addEventListener('click', function () {
    var simdi = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var yeni = simdi === 'dark' ? 'light' : 'dark';
    root.dataset.theme = yeni;
    try { localStorage.setItem('tema', yeni); } catch (e) {}
  });

  // Menüde görünen bölümü vurgula
  var linkler = document.querySelectorAll('nav a');
  if ('IntersectionObserver' in window) {
    var gozlemci = new IntersectionObserver(function (kayitlar) {
      kayitlar.forEach(function (k) {
        if (!k.isIntersecting) return;
        linkler.forEach(function (a) {
          if (a.getAttribute('href') === '#' + k.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { gozlemci.observe(s); });
  }

  // E-postayı kopyala
  var btn = document.getElementById('kopyala');
  var mail = document.getElementById('mail');
  if (btn && mail) btn.addEventListener('click', function () {
    var adres = mail.textContent.trim();
    var bitti = function () {
      btn.textContent = 'Kopyalandı';
      setTimeout(function () { btn.textContent = 'E-postayı kopyala'; }, 2000);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(adres).then(bitti, function () {});
    else { var t = document.createElement('textarea'); t.value = adres; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); bitti(); }
  });

  // Kod kartında daktilo efekti (renkli HTML'i bozmadan harf harf yazar)
  var kod = document.getElementById('typed');
  if (kod && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var dugumler = [], metinler = [];
    var w = document.createTreeWalker(kod, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { dugumler.push(w.currentNode); metinler.push(w.currentNode.nodeValue); w.currentNode.nodeValue = ''; }
    var d = 0, i = 0;
    (function yaz() {
      if (d >= dugumler.length) return;
      i++;
      dugumler[d].nodeValue = metinler[d].slice(0, i);
      if (i >= metinler[d].length) { d++; i = 0; }
      setTimeout(yaz, 38);
    })();
  }
})();