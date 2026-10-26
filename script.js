// ===== 0. LOADING SCREEN =====
const loader = document.getElementById("loader");
document.body.classList.add("memuat");

let timerKode;
let sudahBuka = false;

function bukaHalaman() {
  if (sudahBuka) return; // supaya tidak jalan dua kali (misalnya klik skip + loading selesai)
  sudahBuka = true;
  loader.classList.add("selesai");
  document.body.classList.remove("memuat");
  document.body.classList.add("siap");
  setTimeout(function () {
    clearInterval(timerKode); // hujan kode berhenti setelah tirai hilang
    loader.remove();
  }, 1000);
}

// Tombol Skip (atau tombol Esc / Enter) untuk melewati loading
document.getElementById("loader-skip").addEventListener("click", bukaHalaman);
window.addEventListener("keydown", function (e) {
  if (!sudahBuka && (e.key === "Escape" || e.key === "Enter")) bukaHalaman();
});

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  bukaHalaman(); // animasi dimatikan: langsung buka
} else {
  const angka = document.getElementById("loader-persen");
  const garis = document.getElementById("loader-garis");
  const mulai = performance.now();
  const durasi = 8600; // lama loading (milidetik)

  // Hujan kode di latar belakang (canvas)
  const kanvas = document.getElementById("loader-kode");
  const ctx = kanvas.getContext("2d");
  const huruf = "{}[]()<>/=;:+-*&|01abcdef".split("");
  let tetes = [];
  function ukur() {
    kanvas.width = window.innerWidth;
    kanvas.height = window.innerHeight;
    tetes = Array.from({ length: Math.floor(kanvas.width / 18) }, function () { return Math.random() * -40; });
  }
  ukur();
  window.addEventListener("resize", ukur);
  timerKode = setInterval(function () {
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, kanvas.width, kanvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "14px monospace";
    tetes.forEach(function (y, i) {
      ctx.fillText(huruf[Math.floor(Math.random() * huruf.length)], i * 18, y * 18);
      if (y * 18 > kanvas.height && Math.random() > 0.975) tetes[i] = 0;
      else tetes[i] = y + 1;
    });
  }, 60);

  // Perintah "menjalankan website": diketik, titiknya berputar, lalu jadi hijau + centang
  const log = document.getElementById("loader-log");
  const perintah = ["cd wayyuk-portfolio", "npm install", "npm run build", "npm start"];
  let tandaiSelesai = null;

  function selesai(el) {
    el.classList.add("selesai");
    el.querySelector(".ikon").textContent = "\u2713";
  }

  function jalankan(i) {
    if (i >= perintah.length || sudahBuka) return;
    const terakhir = i === perintah.length - 1;
    const el = document.createElement("div");
    el.className = "langkah";
    el.innerHTML = '<span class="ikon">$</span><span class="teks"></span><span class="titik"></span>';
    log.appendChild(el);
    const teks = el.querySelector(".teks");
    const titik = el.querySelector(".titik");
    const cmd = perintah[i];
    let k = 0;

    // 1) perintahnya diketik huruf demi huruf
    const ketikan = setInterval(function () {
      if (sudahBuka) { clearInterval(ketikan); return; }
      k++;
      teks.textContent = cmd.slice(0, k);
      if (k >= cmd.length) { clearInterval(ketikan); proses(); }
    }, 45);

    // 2) titik berputar, lalu jadi hijau + centang (perintah terakhir terus berputar sampai 100%)
    function proses() {
      let n = 0;
      const timer = setInterval(function () {
        if (sudahBuka) { clearInterval(timer); return; }
        n++;
        if (terakhir) { titik.textContent = ".".repeat((n - 1) % 3 + 1); return; }
        titik.textContent = ".".repeat(n);
        if (n === 3) {
          clearInterval(timer);
          setTimeout(function () { selesai(el); jalankan(i + 1); }, 250);
        }
      }, 320);
      if (terakhir) {
        tandaiSelesai = function () { clearInterval(timer); titik.textContent = "..."; selesai(el); };
      }
    }
  }
  jalankan(0);

  // Tulisan di bawah garis loading berganti tiap ~2 detik
  const info = document.getElementById("loader-info");
  const daftarInfo = ["Junior Developer / Vibe Coder", "Owner of Calm SMP", "Co-owner of Pmoekano V2", "SMK student"];
  let urutInfo = 0;
  const timerInfo = setInterval(function () {
    if (sudahBuka) { clearInterval(timerInfo); return; }
    info.classList.add("ganti");
    setTimeout(function () {
      urutInfo = (urutInfo + 1) % daftarInfo.length;
      info.textContent = daftarInfo[urutInfo];
      info.classList.remove("ganti");
    }, 250);
  }, 2100);

  // Persen naik halus: mulai pelan, lalu melambat pelan-pelan di akhir (tanpa berhenti mendadak)
  function hitung(sekarang) {
    const p = Math.min((sekarang - mulai) / durasi, 1);
    const nilai = 100 * (1 - Math.cos(Math.PI * p)) / 2;
    angka.textContent = Math.round(nilai);
    garis.style.width = nilai + "%";
    if (sudahBuka) return;
    if (p < 1) {
      requestAnimationFrame(hitung);
    } else {
      if (tandaiSelesai) tandaiSelesai(); // perintah terakhir jadi hijau + centang
      setTimeout(function () {
        if (document.readyState === "complete") bukaHalaman();
        else window.addEventListener("load", bukaHalaman);
      }, 250);
    }
  }
  requestAnimationFrame(hitung);
}

// Tombol Copy: menyalin isi atribut data-salin
const toast = document.getElementById("toast");
document.querySelectorAll("[data-salin]").forEach(function (tombol) {
  tombol.addEventListener("click", async function () {
    let pesan = (window.t && window.t("copied")) || "Copied!";
    try { await navigator.clipboard.writeText(tombol.dataset.salin); }
    catch (e) { pesan = (window.t && window.t("copyfail")) || "Copy failed, please copy manually"; }
    toast.textContent = pesan;
    toast.classList.add("tampil");
    setTimeout(function () { toast.classList.remove("tampil"); }, 2000);
  });
});
// ===== 1. SCROLL HALUS =====
const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lenis = null;
console.log("Cek efek -> Lenis termuat:", !!window.Lenis, "| kurangi animasi aktif:", kurangiGerak);

// Lenis (scroll meluncur) dimatikan karena menyebabkan error "tidak bisa scroll" di sebagian komputer.
// Scroll biasa dari browser sudah halus. Untuk mencoba lagi: ubah false jadi true dan aktifkan
// baris <script src=".../lenis.min.js"> di index.html.
const pakaiLenis = false;

if (pakaiLenis && window.Lenis && !kurangiGerak) {
  lenis = new Lenis({ lerp: 0.18 });
  // Pengaman: kalau Lenis error, matikan supaya scroll biasa kembali normal
  window.addEventListener("error", function (e) {
    if (lenis && e.filename && e.filename.indexOf("lenis") !== -1) { lenis.destroy(); lenis = null; }
  }); // makin kecil = makin meluncur tapi terasa berat; makin besar = makin ringan dan cepat
  function putar(waktu) {
    lenis.raf(waktu);
    requestAnimationFrame(putar);
  }
  requestAnimationFrame(putar);
}

// Klik menu: meluncur ke bagian tujuan
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener("click", function (e) {
    const id = a.getAttribute("href");
    const tujuan = id.length > 1 ? document.querySelector(id) : null;
    if (tujuan && lenis) {
      e.preventDefault();
      lenis.scrollTo(tujuan, { offset: -70 });
    }
  });
});

// ===== 2. EFEK MENGETIK SAAT JUDUL TERLIHAT =====
function ketik(el) {
  let i = 0;
  const timer = setInterval(function () {
    const teks = el.dataset.teks; // dibaca ulang supaya ikut berganti kalau bahasa diubah
    i++;
    el.textContent = teks.slice(0, i);
    if (i >= teks.length) {
      clearInterval(timer);
      el.classList.remove("mengetik");
    }
  }, 70); // kecepatan mengetik (milidetik per huruf)
}

if (!kurangiGerak) {
  const pengamatKetik = new IntersectionObserver(function (daftar) {
    daftar.forEach(function (item) {
      if (!item.isIntersecting) return;
      pengamatKetik.unobserve(item.target);
      ketik(item.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll("h2").forEach(function (el) {
    el.dataset.teks = el.textContent;
    el.setAttribute("aria-label", el.textContent);
    el.style.minHeight = el.offsetHeight + "px"; // jaga tinggi supaya halaman tidak loncat
    el.textContent = "";
    el.classList.add("mengetik");
    pengamatKetik.observe(el);
  });
}

// ===== 3. MENU MENYALA SESUAI BAGIAN =====
const linkMenu = document.querySelectorAll("nav ul a");
const pengamatMenu = new IntersectionObserver(function (daftar) {
  daftar.forEach(function (item) {
    if (item.isIntersecting) {
      linkMenu.forEach(function (a) {
        a.classList.toggle("aktif", a.getAttribute("href") === "#" + item.target.id);
      });
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("section[id]").forEach(function (b) { pengamatMenu.observe(b); });
