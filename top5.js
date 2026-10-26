// ===== TOP 5: TOMBOL PLAY / STOP =====
// Play menampilkan pemutar resmi Spotify di bawah lagunya.
// Stop menghapus pemutar itu, jadi musiknya berhenti.
const barisLagu = document.querySelectorAll(".lagu");
const coverMain = document.getElementById("cover-main");
let aktifLagu = null;

// Ambil teks sesuai bahasa yang aktif (EN / ID)
function kata(kunci, cadangan) { return (window.t && window.t(kunci)) || cadangan; }

coverMain.addEventListener("error", function () { coverMain.hidden = true; });

function berhenti() {
  if (!aktifLagu) return;
  aktifLagu.classList.remove("main");
  aktifLagu.querySelector(".embed").innerHTML = ""; // iframe dihapus = musik berhenti
  aktifLagu.querySelector("[data-main]").textContent = kata("play", "Play");
  aktifLagu = null;
  coverMain.hidden = true; // kembali ke huruf W
  coverMain.removeAttribute("src");
}

barisLagu.forEach(function (baris) {
  const tombol = baris.querySelector("[data-main]");

  tombol.addEventListener("click", function () {
    if (aktifLagu === baris) { berhenti(); return; } // klik lagi = Stop
    berhenti(); // hentikan lagu lain dulu

    const iframe = document.createElement("iframe");
    iframe.src = "https://open.spotify.com/embed/track/" + baris.dataset.id + "?utm_source=generator";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.loading = "lazy";
    iframe.title = "Spotify player";
    baris.querySelector(".embed").appendChild(iframe);

    baris.classList.add("main");
    tombol.textContent = kata("stop", "Stop");
    aktifLagu = baris;

    coverMain.hidden = false;
    coverMain.src = baris.dataset.img; // gambar lagu yang diputar
  });
});

// Saat bahasa diganti: perbarui tulisan tombol Play / Stop
window.addEventListener("bahasa", function () {
  barisLagu.forEach(function (baris) {
    baris.querySelector("[data-main]").textContent = baris === aktifLagu ? kata("stop", "Stop") : kata("play", "Play");
  });
});
