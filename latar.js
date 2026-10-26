// ===== LATAR BELAKANG HIDUP =====
(function () {
  const latar = document.createElement("div");
  latar.className = "latar";
  latar.setAttribute("aria-hidden", "true");
  latar.innerHTML =
    '<div class="kisi"></div><div class="sorot"></div>' +
    '<span class="cahaya a"></span><span class="cahaya b"></span>';
  const sorot = latar.querySelector(".sorot");

  // Simbol kode yang mengapung di posisi acak
  const simbol = ["{ }", "</>", "( )", "[ ]", ";", "=>", "01", "//", "&&", "#"];
  for (let i = 0; i < 8; i++) {
    const s = document.createElement("span");
    s.className = "simbol";
    s.textContent = simbol[i % simbol.length];
    s.style.left = Math.random() * 92 + "%";
    s.style.top = Math.random() * 92 + "%";
    s.style.fontSize = 1.2 + Math.random() * 2.2 + "rem";
    s.style.animationDuration = 14 + Math.random() * 16 + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    latar.appendChild(s);
  }

  document.body.prepend(latar);

  // Tandai halaman sedang di-scroll (animasi latar dijeda lewat CSS)
  let timerGulir;
  window.addEventListener("scroll", function () {
    document.documentElement.classList.add("gulir");
    clearTimeout(timerGulir);
    timerGulir = setTimeout(function () { document.documentElement.classList.remove("gulir"); }, 150);
  }, { passive: true });

  // Cahaya lembut mengikuti kursor (hanya di komputer dengan mouse)
  const kurang = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (kurang || !window.matchMedia("(pointer: fine)").matches) return;

  let x = 0, y = 0, menunggu = false;
  window.addEventListener("mousemove", function (e) {
    x = e.clientX;
    y = e.clientY;
    if (menunggu) return;
    menunggu = true;
    requestAnimationFrame(function () {
      sorot.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      menunggu = false;
    });
  }, { passive: true });
})();
