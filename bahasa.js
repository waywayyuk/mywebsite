// ===== BAHASA: EN / ID =====
// Teks bahasa Inggris diambil langsung dari index.html.
// Teks bahasa Indonesia ada di daftar "id" di bawah ini (kunci sama dengan atribut data-i di HTML).
(function () {
  const id = {
    "il1": "Peran",
    "iv1": "Junior Developer, pemilik server Minecraft, dan co-owner komunitas Blox Fruits",
    "il2": "Domisili",
    "iv2": "Sumatra Utara, Indonesia",
    "il3": "Status",
    "iv3": "Masih bersekolah dan fokus belajar",
    "nav_about": "Tentang",
    "nav_projects": "Proyek",
    "nav_top5": "Top 5",
    "nav_contact": "Kontak",
    "skip": "Lewati",
    "bio": "Di bawah 18 btw. Jadilah dirimu sendiri.",
    "btn_proyek": "Lihat proyekku",
    "btn_kontak": "Hubungi aku",
    "h_about": "Tentang saya",
    "a1": "Halo, aku Wahyu Raditya Baril, tapi kamu bisa memanggilku Wayyuk. Kebanyakan orang memanggil Wahyu, tapi aku lebih suka Wayyuk karena terdengar bagus saja.",
    "a2": "Usiaku? Rahasia, kecuali kamu transfer 100 ribu rupiah dulu (bercanda).",
    "a3": "Aku siswa SMK jurusan TKJ (Teknik Komputer dan Jaringan) dari Sumatra Utara. Orang bilang website itu urusan anak RPL (Rekayasa Perangkat Lunak), tapi aku tidak terlalu peduli. Semua orang bisa punya website sendiri.",
    "a4": "Aku cuma vibe coder yang banyak waktu luang. Sekarang aku melatih skill HTML, Python, dan JavaScript (yang paling baru) untuk membuat website dan plugin kecil untuk server Minecraft.",
    "a5": "Di luar dunia pemrograman, aku mengelola server Minecraft; aku juga co-owner Pmoekano V2 dan kapten crew di sana.",
    "t_owner": "Pemilik Calm SMP",
    "t_coowner": "Co-owner Pmoekano V2",
    "t_smk": "Siswa SMK",
    "h_projects": "Proyek",
    "p1s": "· Pemilik Calm SMP",
    "p1d": "pemilik dan developer Calm SMP",
    "p1b": "Website segera hadir",
    "p2s": "· kapten divisi 1",
    "p2d": "Saya memimpin Divisi 1 crew Pmoekano V2",
    "p3h": "Segera ada lagi",
    "p3s": "GitHub · segera hadir",
    "p3d": "Proyek latihanku akan dipublikasikan di GitHub setelah selesai.",
    "p3b": "GitHub segera hadir",
    "h_top5": "Top 5 Milikku",
    "t5h": "Lagu yang diulang-ulang",
    "t5d": "Lima lagu yang selalu kuputar ulang. Tekan Play untuk mendengarkan di sini, atau buka lagunya di Spotify.",
    "note_a": "Mau lihat lagu favorit Wayyuk lainnya? Klik ",
    "note_link": "Lihat playlist Wayyuk",
    "listen": "Dengarkan di Spotify",
    "h_contact": "Kontak",
    "k_intro": "Mau ngobrol, kolaborasi, atau sekadar menyapa? Pilih yang kamu suka.",
    "copy": "Salin",
    "play": "Putar",
    "stop": "Berhenti",
    "copied": "Tersalin!",
    "copyfail": "Gagal menyalin, silakan salin manual"
  };

  const elemen = document.querySelectorAll("[data-i]");
  const en = { play: "Play", stop: "Stop", copied: "Copied!", copyfail: "Copy failed, please copy manually" };
  elemen.forEach(function (el) {
    const k = el.dataset.i;
    if (!(k in en)) en[k] = el.dataset.teks !== undefined ? el.dataset.teks : el.innerHTML;
  });
  const kamus = { en: en, id: id };

  let bahasa = "en";
  try {
    const simpan = localStorage.getItem("bahasa");
    if (simpan === "id" || simpan === "en") bahasa = simpan;
  } catch (e) {}

  // Dipakai script lain untuk mengambil teks sesuai bahasa yang aktif
  window.t = function (kunci) {
    return (kamus[bahasa] && kamus[bahasa][kunci]) || kamus.en[kunci] || "";
  };

  const tombol = document.querySelectorAll("[data-bahasa]");

  function terapkan(b) {
    bahasa = b;
    document.documentElement.lang = b;
    elemen.forEach(function (el) {
      const teks = kamus[b][el.dataset.i];
      if (teks === undefined) return;
      if (el.tagName === "H2") {
        el.dataset.teks = teks;
        el.setAttribute("aria-label", teks);
        if (!el.classList.contains("mengetik")) el.textContent = teks;
      } else {
        el.innerHTML = teks;
      }
    });
    tombol.forEach(function (t) {
      const aktif = t.dataset.bahasa === b;
      t.classList.toggle("aktif", aktif);
      t.setAttribute("aria-pressed", aktif);
    });
    window.dispatchEvent(new Event("bahasa"));
  }

  tombol.forEach(function (t) {
    t.addEventListener("click", function () {
      terapkan(t.dataset.bahasa);
      try { localStorage.setItem("bahasa", t.dataset.bahasa); } catch (e) {}
    });
  });

  terapkan(bahasa);
})();
