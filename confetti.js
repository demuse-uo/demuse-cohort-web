/* =========================================================================
   CONFETTI LOTTIE  —  halaman Birthday
   -------------------------------------------------------------------------
   Animasi confetti yang jatuh saat halaman Kalender Ulang Tahun dibuka.

   TIGA ATURAN YANG DIPEGANG FILE INI
   1. Tidak memperlambat halaman.
      Pustaka Lottie (sekitar 150 KB) baru diunduh SETELAH seluruh halaman
      selesai dimuat. Jadi confetti tidak pernah menunda tampilnya kartu
      ulang tahun.
   2. Hanya di halaman ini.
      Halaman lain tidak ikut mengunduh apa pun.
   3. Menghormati pengaturan "kurangi animasi".
      Kalau pengunjung mematikan animasi di perangkatnya, pustaka Lottie
      tidak diunduh sama sekali.

   KALAU ADA YANG ULANG TAHUN HARI INI
   Confetti diputar dua kali, bukan sekali. Datanya diambil dari daftar
   `birthdays` di script.js, jadi tidak perlu diatur manual.

   CARA MENCOBA TANPA MENUNGGU ADA YANG ULANG TAHUN
   Di script.js, ubah sementara tanggal salah satu orang jadi tanggal
   hari ini (format 'MM-DD'), lalu muat ulang halaman.
   ========================================================================= */

(() => {

  const wadah = document.getElementById('confetti');
  if (!wadah) return;                       // bukan halaman Birthday

  // pengunjung mematikan animasi -> jangan unduh apa pun
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const PUSTAKA = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie_light.min.js';
  const BERKAS  = 'confetti.json';


  /* ---------- apakah hari ini ada yang ulang tahun? ---------- */
  function adaYangUltah() {
    // birthdays dan sisaHari berasal dari script.js, yang dimuat lebih dulu
    if (typeof birthdays === 'undefined' || typeof sisaHari !== 'function') return false;
    return birthdays.some(orang => sisaHari(orang.tgl) === 0);
  }


  /* ---------- unduh pustaka Lottie, lalu jalankan ---------- */
  function muatPustaka() {
    return new Promise((selesai, gagal) => {
      const s = document.createElement('script');
      s.src = PUSTAKA;
      s.onload = selesai;
      s.onerror = () => gagal(new Error('Pustaka Lottie gagal diunduh'));
      document.head.appendChild(s);
    });
  }


  function mainkan() {
    const ulang = adaYangUltah() ? 2 : 1;    // hari H diputar dua kali
    let sisa = ulang;

    const anim = lottie.loadAnimation({
      container: wadah,
      renderer:  'svg',
      loop:      true,                       // diurus manual di bawah
      autoplay:  true,
      path:      BERKAS
    });

    // hitung putaran, lalu berhenti dan bersihkan
    anim.addEventListener('loopComplete', () => {
      sisa -= 1;
      if (sisa <= 0) {
        anim.stop();
        anim.destroy();                      // lepas dari memori
        wadah.remove();                      // buang wadahnya juga
      }
    });

    // kalau berkasnya bermasalah, jangan bikin halaman error
    anim.addEventListener('data_failed', () => {
      console.warn('confetti.json gagal dibaca');
      wadah.remove();
    });
  }


  /* ---------- tunggu halaman benar-benar selesai dulu ---------- */
  function mulai() {
    // jeda sedikit supaya tidak berebut dengan animasi GSAP yang baru jalan
    setTimeout(() => {
      muatPustaka()
        .then(mainkan)
        .catch(err => {
          console.warn(err.message);
          wadah.remove();
        });
    }, 600);
  }

  if (document.readyState === 'complete') mulai();
  else window.addEventListener('load', mulai);

})();
